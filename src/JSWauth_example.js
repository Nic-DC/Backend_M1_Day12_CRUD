import jwt from "jsonwebtoken";

const payload = {
  _id: "123oijo123jo23",
  role: "User",
  /* password: "1234",  */ // DO NOT STORE SENSITIVE DATA INSIDE THE PAYLOAD OF THE TOKEN!!!!!!!!
};

const secret = "mysup3rs3cr3t";
const wrongSecret = "asdasdasd";

const options = { expiresIn: "1" };

// **************************************** SYNC ********************************************

/* const token = jwt.sign(payload, secret, options)
console.log("TOKEN:", token)
const originalPayload = jwt.verify(token, secret)
console.log("PAYLOAD:", originalPayload)
 */

// ************************************** ASYNC ********************************************

jwt.sign(payload, secret, options, (err, token) => {
  if (err) console.log(err);
  else console.log(token);
});

/* jwt.verify(token, secret, (err, originalPayload) => {
    if (err) console.log(err)
    else console.log(originalPayload)
}) */

// *************************** HOW TO CONVERT A CALLBACK BASED FUNCTION INTO A PROMISE BASED FUNCTION *****************************

const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    })
  );

const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    })
  );

/* createAccessToken({})
  .then(token => console.log(token))
  .catch(err => console.log(err))
 */

try {
  const token = await createAccessToken({});
  console.log(token);
} catch (error) {
  console.log(error);
}
