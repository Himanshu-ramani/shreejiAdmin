// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

const getWebsite = () => 'http://localhost:5000';
const getToken = () =>
  'basic eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzZkYThlMDQ5NGRlMjYyZjlmYjI3NiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwMjI4ODA3NCwiZXhwIjoxNzAyNTQ3Mjc0fQ.-jgQlo_Yrg3hfDK5-bXE3VZjug4aVVZeOqxb4OnNkA8';
// eslint-disable-next-line consistent-return
const apiCall = async ({ endpoint, method = 'GET', ...other }) => {
  const website = getWebsite();
  const token = getToken();
  try {
    const { data: res } = await axios({
      url: `${website}/${endpoint}`,
      method,
      headers: { token },
      ...other,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
function isArrayWithValues(value) {
  // Check if the value is an array
  if (Array.isArray(value)) {
    // Check if the array has non-empty elements
    return value.length > 0;
  }
  return false; // Return false for non-array values
}
function isObjWithValues(value) {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // Check if the object has at least one property
    return Object.keys(value).length > 0;
  }
  return false; // Return false for non-object values
}
export { apiCall, getWebsite, isObjWithValues, isArrayWithValues };
