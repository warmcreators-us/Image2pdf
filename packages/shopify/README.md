## Shopify Provider

**Demo:** https://shopify.demo.vercel.store/

Before getting started, a [Shopify](https://www.shopify.com/) account and store is required before using the provider.

Next, copy the `.env.template` file in this directory to `.env.local` in the main directory (which will be ignored by Git):

```bash
cp packages/shopify/.env.template .env.local
```

Then, set the environment variables in `.env.local` to match the ones from your store.

## Contribute

Our commitment to Open Source can be found [here](https://vercel.com/oss).

If you find an issue with the provider or want a new feature, feel free to open a PR or [create a new issue](https://github.com/vercel/commerce/issues).

## Modifications

These modifications are temporarily until contributions are made to remove them.

### Adding item to Cart

```js
// components/product/ProductView/ProductView.tsx
const ProductView: FC<Props> = ({ product }) => {
  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem({
        productId: product.id,
        variantId: variant ? variant.id : product.variants[0].id,
      })
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }
}
```

### Proceed to Checkout

```js
// components/cart/CartSidebarView/CartSidebarView.tsx
import { useCommerce } from '@framework'

const CartSidebarView: FC = () => {
  const { checkout } = useCommerce()
  return (
    <Button href={checkout.webUrl} Component="a" width="100%">
      Proceed to Checkout
    </Button>
  )
}
```

## APIs

Collections of APIs to fetch data from a Shopify store.

The data is fetched using the [Shopify JavaScript Buy SDK](https://github.com/Shopify/js-buy-sdk#readme). Read the [Shopify Storefront API reference](https://shopify.dev/docs/storefront-api/reference) for more information.

### getProduct

Get a single product by its `handle`.

```js
import getProduct from '@framework/product/get-product'
import { getConfig } from '@framework/api'

const config = getConfig()

const product = await getProduct({
  variables: { slug },
  config,
})
```

### getAllProducts

```js
import getAllProducts from '@framework/product/get-all-products'
import { getConfig } from '@framework/api'

const config = getConfig()

const { products } = await getAllProducts({
  variables: { first: 12 },
  config,
})
```

### getAllCollections

```js
import getAllCollections from '@framework/product/get-all-collections'
import { getConfig } from '@framework/api'

const config = getConfig()

const collections = await getAllCollections({
  config,
})
```

### getAllPages

```js
import getAllPages from '@framework/common/get-all-pages'
import { getConfig } from '@framework/api'

const config = getConfig()

const pages = await getAllPages({
  variables: { first: 12 },
  config,
})
```

## Code generation

This provider makes use of GraphQL code generation. The [schema.graphql](./schema.graphql) and [schema.d.ts](./schema.d.ts) files contain the generated types & schema introspection results.

When developing the provider, changes to any GraphQL operations should be followed by re-generation of the types and schema files:

From the project root dir, run:

```sh
yarn generate:shopify
```
## Examples
  {
    "name": "@vercel/commerce-shopify",
    "version": "0.0.1",
    "license": "MIT",
    "scripts": {
      "release": "taskr release",
      "build": "taskr build",
      "dev": "taskr",
      "types": "tsc --emitDeclarationOnly",
      "prettier-fix": "prettier --write .",
      "generate": "DOTENV_CONFIG_PATH=./.env graphql-codegen -r dotenv/config"
    },
    "sideEffects": false,
    "type": "module",
    "exports": {
      ".": "./dist/index.js",
      "./*": [
        "./dist/*.js",
        "./dist/*/index.js"
      ],
      "./next.config": "./dist/next.config.cjs"

## A version of the API.
  """
  type ApiVersion {
    """
    The human-readable name of the version.
    """
    displayName: String!

    """
    The unique identifier of an ApiVersion. All supported API versions have a date-based (YYYY-MM) or `unstable` handle.
    """
    handle: String!

    """
    Whether the version is actively supported by Shopify. Supported API versions are guaranteed to be stable. Unsupported API versions include unstable, release candidate, and end-of-life versions that are marked as unsupported. For more information, refer to [Versioning](https://shopify.dev/concepts/about-apis/versioning).
    """
    supported: Boolean!
  }
