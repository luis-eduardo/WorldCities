import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject, NgModule } from '@angular/core';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { environment } from '../environments/environment';

export function createApollo(): ApolloClient.Options {
  const uri = environment.baseUrl + 'api/graphql';
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache({ resultCaching: false }),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache' },
      query: { fetchPolicy: 'no-cache' },
    }
  };
}

@NgModule({
  providers: [provideApollo(createApollo)],
})
export class GraphQLModule {}
