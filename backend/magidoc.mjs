export default {
  introspection: {
    type: "url",
    url: "http://localhost:4000/graphql",
  },
  website: {
    template: "carbon-multi-page",
    options: {
      queryGenerationFactories: {
        DateTimeISO: '"2025-03-04T12:00:00Z"'
      },
    },
  },
};
