let parsedData = [];
let uploaded = false;

module.exports = {
  getParsedData: () => parsedData,
  setParsedData: (data) => {
    parsedData = data;
    uploaded = true;
  },
  isUploaded: () => uploaded,
  resetData: () => {
    parsedData = [];
    uploaded = false;
  }
};
