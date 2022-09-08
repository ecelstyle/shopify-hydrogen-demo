import { Suspense } from 'react';
import {
  useShopQuery,
  gql,
  useLocalization,
  Seo,
  fetchSync,
  CacheNone,
} from '@shopify/hydrogen';

import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments';
import { PAGINATION_SIZE } from '~/lib/const';
import { ProductGrid, PageHeader, Section } from '~/components';
import { Layout } from '~/components/index.server';

export default function AllProducts() {
  return (
    <Layout>
      <Seo type="page" data={{ title: 'All Products' }} />
      <PageHeader heading="All Products" variant="allCollections" />
      <Section>
        <Suspense>
          <AllProductsGrid />
        </Suspense>
      </Section>
    </Layout>
  );
}

var queryFilter = 'tag_not:nft*';

function AllProductsGrid() {
  const {
    language: { isoCode: languageCode },
    country: { isoCode: countryCode },
  } = useLocalization();

  queryFilter = 'tag_not:nft*';

  var customerWalletAddress = '';

  const wallet = fetchSync('/account/wallet', {
    preload: true,
    cache: CacheNone(),
  }).json();

  customerWalletAddress = wallet.customerWalletAddress;

  if (customerWalletAddress != undefined) {
    const nfts = fetchSync(
      'https://polygon-mainnet.g.alchemyapi.io/nft/v2/LSGxtnWyqLArr-uC4xDSAlIeHDX5BDIg/getNFTs?owner=' +
        customerWalletAddress,
      {
        preload: true,
        cache: CacheNone(),
      }
    ).json();

    var tokens = [];
    if (nfts.ownedNfts != null) {
      for (let i = 0; i < nfts.ownedNfts.length; i++) {
        var obj = {};
        obj.address = nfts.ownedNfts[i].contract.address;
        obj.tokenId = parseInt(nfts.ownedNfts[i].id.tokenId, 16);
        tokens.push(obj);
      }
    }

    console.log(tokens);

    queryFilter = '';

    for (let i = 0; i < tokens.length; i++) {
      if (
        tokens[i].address == '0x818143e1543c038285c9f4a59432d280cc7ca77d' ||
        tokens[i].address == '0x8dC7b6EC6FafA36085EE9ec8e39112428D3360aa'
      ) {
        if (queryFilter != '') queryFilter += ' OR';
        queryFilter += 'tag:nft-' + tokens[i].tokenId;
      }
    }
  }
  //queryFilter += ' OR tag_not:nft*';

  const ALL_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $pageBy, after: $cursor, query: "${queryFilter}") {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

  console.log(ALL_PRODUCTS_QUERY);

  const { data } = useShopQuery({
    query: ALL_PRODUCTS_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      pageBy: PAGINATION_SIZE,
    },
    preload: true,
  });

  const products = data.products;

  return (
    <>
      <ProductGrid
        key="products"
        url={`/products?country=${countryCode}`}
        collection={{ products }}
      />
    </>
  );
}

// API to paginate products
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
export async function api(request, { params, queryShop }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const { handle } = params;

  return await queryShop({
    query: PAGINATE_ALL_PRODUCTS_QUERY,
    variables: {
      handle,
      cursor,
      pageBy: PAGINATION_SIZE,
      country,
    },
  });
}

const PAGINATE_ALL_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsPage(
    $pageBy: Int!
    $cursor: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
