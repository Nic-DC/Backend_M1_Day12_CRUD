// import bcrypt from "bcryptjs";

// const plainPW = "1234";
// const numberOfRounds = 12;
// // rounds= 10 means that the algorithm will be calculated 2^10 times --> 1024 times
// // rounds= 11 means that the algorithm will be calculated 2^11 times --> 2048 times
// console.log(
//   `rounds=${numberOfRounds} means that the algorithm will be calculated 2^${numberOfRounds} times --> ${Math.pow(
//     2,
//     numberOfRounds
//   )} times`
// );
// console.time("hash");
// const hash = bcrypt.hashSync(plainPW, numberOfRounds);
// console.timeEnd("hash");

// console.log("HASH:", hash);

// const isPWOk = bcrypt.compareSync(plainPW, hash);

// console.log("Do they match?", isPWOk);

// //// They are not just doing hash("1234")
// //// They are generating a random string (aka the Salt) "ZC97uz.uisxcT.VPxL7UF"
// //// And then hash("ZC97uz.uisxcT.VPxL7UF1234")
// // This salt is making Rainbow Tables useless and therefore attackers are forced to use Brute Force Attacks

// //// BRUTE FORCE ATTACK
// //// 11111111 --> calculate hash ("B.uM06Lce3Rdl2TDseS6K11111111")
// //// 11111112 --> calculate hash ("B.uM06Lce3Rdl2TDseS6K11111112")
