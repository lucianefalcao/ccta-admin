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
      .collection("usuarios")
      .where("email", "==", data.email)
      .where("estado", "==", "I")
      .get();

  if (usersData.empty) {
    const newUser = await admin.auth().createUser({
      uid: data.id as string,
      disabled: false,
      email: data.email as string,
      displayName: data.name as string,
    });

    const usuariosRef = admin.firestore().collection("usuarios")
        .doc(newUser.uid);
    const contadoresRef = admin.firestore().collection("contadores")
        .doc("usuarios");
    const batch = admin.firestore().batch();

    batch.set(usuariosRef, {
      email: newUser.email,
      nome: newUser.displayName,
      estado: "A",
    });
    batch.update(contadoresRef, {
      total: admin.firestore.FieldValue.increment(1),
    });

    await batch.commit();

    return {uid: newUser.uid};
  }

  for (const userData of usersData.docs) {
    await admin.firestore().collection("usuarios").doc(userData.id).update({
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

export const inactivateUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "O usuário não está autenticado."
    );
  }

  admin.auth().updateUser(data.id, {
    disabled: true,
  });

  const usuariosRef = admin.firestore().collection("usuarios")
      .doc(data.id);
  const contadoresRef = admin.firestore().collection("contadores")
      .doc("usuarios");
  const batch = admin.firestore().batch();

  batch.update(usuariosRef, {
    estado: "I",
  });
  batch.update(contadoresRef, {
    total: admin.firestore.FieldValue.increment(-1),
  });

  await batch.commit();
});

export const updateUser = functions.https.onCall(async (data) => {
  return await admin.auth().updateUser(data.id, {
    password: data.password,
  });
});
