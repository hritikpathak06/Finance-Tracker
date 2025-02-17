import axios from "axios";

export const get_all_categories = async () => {
  const { data } = await axios.get(`/api/category/all`);
  return data.categories;
};
