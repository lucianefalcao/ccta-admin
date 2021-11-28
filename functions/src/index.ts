import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "O usuário não está autenticado."
    );
  }

  const users = await admin.auth().getUsers([{email: data.email}]);

  if (users.users.length > 0) {
    throw new functions.https.HttpsError(
        "already-exists",
        "Esse email já existe."
    );
  }

  const usersData = await admin.firestore()
      .collection("users")
      .where("email", "==", data.email)
      .where("state", "==", "X")
      .get();

  if (usersData.empty) {
    const newUser = await admin.auth().createUser({
      disabled: false,
      email: data.email as string,
      displayName: data.name as string,
    });

    await admin.firestore().collection("users").doc(newUser.uid).set({
      email: newUser.email,
      name: newUser.displayName,
      state: "A",
    });

    return {uid: newUser.uid};
  }

  for (const userData of usersData.docs) {
    console.log(userData.id);
    await admin.firestore().collection("users").doc(userData.id).update({
      email: userData.data().email,
      name: data.name,
      state: "A",
    });

    await admin.auth().createUser({
      uid: userData.id,
      disabled: false,
      email: userData.data().email as string,
      displayName: data.name as string,
    });

    return {uid: userData.id};
  }

  return {};
});

export const removeUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "O usuário não está autenticado."
    );
  }

  const users = await admin.auth().getUsers([{email: data.email}]);

  for (const user of users.users) {
    await admin.auth().deleteUser(user.uid);
  }
});

export const updateUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "O usuário não está autenticado."
    );
  }

  return await admin.auth().updateUser(data.uid, {
    password: data.password,
  });
});
