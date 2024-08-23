// Utility function to cache and retrieve data

const cacheData = (key: string, data: any) => {
  const stringValue = JSON.stringify(data);
  localStorage.setItem(key, stringValue);
};

const retrieveCacheData = (key: string) => {
  const data = localStorage.getItem(key);
  if (!data) {
    console.log("CACHED DATA IS NULL => ", data);
    return;
  }
  return JSON.parse(data);
};

const isAuthenticated = () => {
  const user = retrieveCacheData("user");
  return !!user;
};

export { cacheData, isAuthenticated, retrieveCacheData };
