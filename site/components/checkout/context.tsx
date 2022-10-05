import React, {
  FC,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  createContext,
} from 'react'
import type { CardFields } from '@commerce/types/customer/card'
import type { AddressFields } from '@commerce/types/customer/address'

export type State = {
  cardFields: CardFields
  addressFields: AddressFields
}

type CheckoutContextType = State & {
  setCardFields: (cardFields: CardFields) => void
  setAddressFields: (addressFields: AddressFields) => void
  clearCheckoutFields: () => void
}

type Action =
  | {
      type: 'SET_CARD_FIELDS'
      card: CardFields
    }
  | {
      type: 'SET_ADDRESS_FIELDS'
      address: AddressFields
    }
  | {
      type: 'CLEAR_CHECKOUT_FIELDS'
    }

const initialState: State = {
  cardFields: {} as CardFields,
  addressFields: {} as AddressFields,
}

export const CheckoutContext = createContext<State | any>(initialState)

CheckoutContext.displayName = 'CheckoutContext'

const checkoutReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CARD_FIELDS':
      return {
        ...state,
        cardFields: action.card,
      }
    case 'SET_ADDRESS_FIELDS':
      return {
        ...state,
        addressFields: action.address,
      }
    case 'CLEAR_CHECKOUT_FIELDS':
      return {
        ...state,
        cardFields: initialState.cardFields,
        addressFields: initialState.addressFields,
      }
    default:
      return state
  }
}

export const CheckoutProvider: FC = (props) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  const setCardFields = useCallback(
    (card: CardFields) => dispatch({ type: 'SET_CARD_FIELDS', card }),
    [dispatch]
  )

  const setAddressFields = useCallback(
    (address: AddressFields) =>
      dispatch({ type: 'SET_ADDRESS_FIELDS', address }),
    [dispatch]
  )

  const clearCheckoutFields = useCallback(
    () => dispatch({ type: 'CLEAR_CHECKOUT_FIELDS' }),
    [dispatch]
  )
  <form
  onSubmit={handleSubmit}
  className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm"
>
  <ul className="pb-2">
    <li className="flex justify-between py-1">
      <span>Subtotal</span>
      <span>{subTotal}</span>
    </li>
    <li className="flex justify-between py-1">
      <span>Taxes</span>
      <span>Calculated at checkout</span>
    </li>
    <li className="flex justify-between py-1">
      <span>Shipping</span>
      <span className="font-bold tracking-wide">FREE</span>
    </li>
  </ul>
  <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
    <span>Total</span>
    <span>{total}</span>
  </div>
  <div>
    {/* Once data is correctly filled */}
    <Button
      type="submit"
      width="100%"
      disabled={!checkoutData?.hasPayment || !checkoutData?.hasShipping}
      loading={loadingSubmit}
    >
      Confirm Purchase
    </Button>
  </div>
</form>
  const cardFields = useMemo(() => state.cardFields, [state.cardFields])

  const addressFields = useMemo(() => state.addressFields, [state.addressFields])

  const value = useMemo(
    () => ({
      cardFields,
      addressFields,
      setCardFields,
      setAddressFields,
      clearCheckoutFields,
    }),
    [cardFields, addressFields, setCardFields, setAddressFields, clearCheckoutFields]
  )

  return <CheckoutContext.Provider value={value} {...props} />
}

export const useCheckoutContext = () => {
  const context = useContext<CheckoutContextType>(CheckoutContext)
  if (context === undefined) {
    throw new Error(`useCheckoutContext must be used within a CheckoutProvider`)
  }
  return context
}
import Link from 'next/link'
import { FC, useState } from 'react'
import CartItem from '@components/cart/CartItem'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import useCheckout from '@framework/checkout/use-checkout'
import ShippingWidget from '../ShippingWidget'
import PaymentWidget from '../PaymentWidget'
import s from './CheckoutSidebarView.module.css'
import { useCheckoutContext } from '../context'

const CheckoutSidebarView: FC = () => {
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const { setSidebarView, closeSidebar } = useUI()
  const { data: cartData, mutate: refreshCart } = useCart()
  const { data: checkoutData, submit: onCheckout } = useCheckout()
  const { clearCheckoutFields } = useCheckoutContext()

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    try {
      setLoadingSubmit(true)
      event.preventDefault()

      await onCheckout()
      clearCheckoutFields()
      setLoadingSubmit(false)
      refreshCart()
      closeSidebar()
    } catch {
      // TODO - handle error UI here.
      setLoadingSubmit(false)
    }
  }

  const { price: subTotal } = usePrice(
    cartData && {
      amount: Number(cartData.subtotalPrice),
      currencyCode: cartData.currency.code,
    }
  )
  const { price: total } = usePrice(
    cartData && {
      amount: Number(cartData.totalPrice),
      currencyCode: cartData.currency.code,
    }
  )

  return (
    <SidebarLayout
      className={s.root}
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <div className="px-4 sm:px-6 flex-1">
        <Link href="/cart">
          <a>
            <Text variant="sectionHeading">Checkout</Text>
          </a>
        </Link>

        <PaymentWidget
          isValid={checkoutData?.hasPayment}
          onClick={() => setSidebarView('PAYMENT_VIEW')}
        />
        <ShippingWidget
          isValid={checkoutData?.hasShipping}
          onClick={() => setSidebarView('SHIPPING_VIEW')}
        />

        <ul className={s.lineItemsList}>
          {cartData!.lineItems.map((item: any) => (
            <CartItem
              key={item.id}
              item={item}
              currencyCode={cartData!.currency.code}
              variant="display"
            />
          ))}
        </ul>
      </div>

     
    </SidebarLayout>
  )
}

export default CheckoutSidebarView

