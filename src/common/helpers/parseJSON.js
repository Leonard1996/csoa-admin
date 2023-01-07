export default function parseJson(stringifiedObject) {
  let result = null;
  try {
    result = JSON.parse(stringifiedObject)
  } catch (error) {
    console.log(`error parsing stringified object ${error}`)
  }
  return result;
}