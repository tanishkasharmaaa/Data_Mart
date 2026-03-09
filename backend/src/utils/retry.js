const retryQuery = async (queryFn, retries = 3) => {
  try {
    return await queryFn();
  } catch (error) {
    console.log("DB request failed, retrying...", retries);

    if (retries <= 0) {
      throw error;
    }

    await new Promise((res) => setTimeout(res, 1000)); // wait 1s
    console.log(retries)
    return retryQuery(queryFn, retries - 1);
  }
};

module.exports = retryQuery