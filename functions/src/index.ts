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

  const user = await admin.auth().getUserByEmail(data.email);
  if (user.uid.length > 0) {
    throw new functions.https.HttpsError(
        "already-exists",
        "Esse email já existe."
    );
  }

  const newUser = await admin.auth().createUser({
    disabled: false,
    email: data.email as string,
    displayName: data.name as string,
  });

  await admin.firestore().collection("users").doc(newUser.uid).set({
    email: newUser.email,
    name: newUser.displayName,
  });

  return {
    uid: newUser.uid,
  };
});
