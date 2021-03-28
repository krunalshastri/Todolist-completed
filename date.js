
module.exports.getDate = function()
{
  let today_date = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return today_date.toLocaleDateString("en-US",options);
}

module.exports.getDay = function()
{
  let today_date = new Date();
  let options = {
    weekday: "long",
  };
  return today_date.toLocaleDateString("en-US",options);
}