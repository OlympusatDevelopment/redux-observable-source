export const adapterMap = [
  {
    dataKey: 'data.data.offers',// dot syntax gets parsed to the correct location in the object, for graphql use cases
    model : 'Offer',
    branch : 'offers',
    strategy : false // theirs, ours, false(replace)
  }
];