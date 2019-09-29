# Graff Exchange

Fullstack application with data from web socket, SQL data store, external APIs, Redis cache

## Front End

- React, global state management with Redux
- SASS (no CSS framework) 
- socket connection to IEX api integrated into Redux store

Deployed: http://graff.joncannon.codes

Codebase for front end application: https://github.com/iamjoncannon/Graff_Exchange

## Back End

technologies: Node.js, GraphQL (Apollo client/server), Redis, PostgreSQL, AWS(EC2) 

Features:
- Authentication in GraphQL/Apollo Server via JWT
- trade mutation with "atomic" SQL transaction 
- data aggregated from PostgreSQL data store and external financial APIs 
- Redis caching with cache eviction strategy for each data source
