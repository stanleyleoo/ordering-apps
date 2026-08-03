import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { products as defaultProducts, customers as defaultCustomers, orders as defaultOrders } from '../data/mockData'

const AppContext = createContext()
const STORAGE_KEY = 'simple-ordering-app-state'

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...initialState, ...action.payload }
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload }
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.productId === action.payload.productId)
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) }
    case 'UPDATE_QTY': {
      const { productId, qty } = action.payload
      if (qty <= 0) return { ...state, cart: state.cart.filter(i => i.productId !== productId) }
      return { ...state, cart: state.cart.map(i => i.productId === productId ? { ...i, qty } : i) }
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'SET_PHONE':
      return { ...state, phoneInput: action.payload }
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.payload }
    case 'SET_CUSTOMER':
      return { ...state, identifiedCustomer: action.payload }
    case 'SET_SHOW_CART':
      return { ...state, showCart: action.payload }
    case 'ADD_ORDER': {
      const newOrder = {
        id: `ORD-${String(state.orders.length + 1).padStart(3, '0')}`,
        customer: action.payload.customer,
        items: action.payload.items,
        total: action.payload.total,
        status: 'pending',
        timestamp: new Date().toISOString(),
        paymentMethod: action.payload.paymentMethod,
      }
      return { ...state, orders: [newOrder, ...state.orders], cart: [], showCart: false, lastOrder: newOrder, phoneInput: '', customerName: '', identifiedCustomer: null }
    }
    case 'UPDATE_ORDER_STATUS': {
      const orders = state.orders.map(o => o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o)
      const updated = orders.find(o => o.id === action.payload.orderId)
      return { ...state, orders, lastOrder: state.lastOrder && state.lastOrder.id === action.payload.orderId ? updated : state.lastOrder }
    }
    case 'RATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.payload.orderId
          ? { ...o, rating: action.payload.rating, review: action.payload.review || '', reviewedAt: new Date().toISOString() }
          : o),
      }
    case 'SET_LAST_ORDER':
      return { ...state, lastOrder: action.payload }
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] }
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) }
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] }
    case 'UPDATE_CUSTOMER':
      return { ...state, customers: state.customers.map(c => c.id === action.payload.id ? action.payload : c) }
    case 'DELETE_CUSTOMER':
      return { ...state, customers: state.customers.filter(c => c.id !== action.payload) }
    case 'SET_ADMIN_PAGE':
      return { ...state, adminPage: action.payload }
    default:
      return state
  }
}

const initialState = {
  products: defaultProducts,
  customers: defaultCustomers,
  orders: defaultOrders,
  cart: [],
  activeCategory: 'All',
  phoneInput: '',
  customerName: '',
  identifiedCustomer: null,
  showCart: false,
  lastOrder: null,
  adminPage: 'dashboard',
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return { ...initialState, ...JSON.parse(saved) }
    } catch { /* ignore corrupt storage */ }
    return initialState
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* storage full */ }
  }, [state])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { dispatch({ type: 'HYDRATE', payload: JSON.parse(e.newValue) }) } catch { /* ignore */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const identifyCustomer = useCallback((phone) => {
    const found = state.customers.find(c => c.phone === phone)
    if (found) {
      dispatch({ type: 'SET_CUSTOMER', payload: found })
      dispatch({ type: 'SET_CUSTOMER_NAME', payload: found.name })
    } else {
      dispatch({ type: 'SET_CUSTOMER', payload: null })
      dispatch({ type: 'SET_CUSTOMER_NAME', payload: '' })
    }
  }, [state.customers])

  return (
    <AppContext.Provider value={{ state, dispatch, identifyCustomer }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
