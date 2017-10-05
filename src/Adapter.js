/**
 * Transform the stream here via adapterMap analysis
 * @param {*} adapterMap 
 */
export const _EdsAdapter = adapterMap => streamData => {
  // Decipher here what branch the data must go to
  let branch, strategy, data;

  adapterMap.forEach(adapter => {
    const keys = adapter.hasOwnProperty('dataKey') ?
      adapter.dataKey.split('.') : [];

    data = keys.reduce((sum, k) =>
      sum.hasOwnProperty(k) ? sum[k] : false,
      { ...streamData });

    if (data) {
      branch = adapter.branch;
      strategy = adapter.strategy;
    }
  });

  return data ? {
    branch,
    strategy,
    data
  } : false;
};