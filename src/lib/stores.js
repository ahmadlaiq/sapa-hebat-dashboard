import { writable } from "svelte/store";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

function createCollectionStore(collectionName, ...queryConstraints) {
  const { subscribe, set } = writable([], () => {
    let unsubscribe = () => {};

    // Ensure this only runs if db is initialized (Environment might be optional)
    if (typeof window !== "undefined") {
      const q = query(collection(db, collectionName), ...queryConstraints);
      unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        set(data);
      });
    }
    return unsubscribe;
  });
  return { subscribe };
}

export const gurus = createCollectionStore(
  "users",
  where("role", "==", "guru"),
);
export const ortus = createCollectionStore(
  "users",
  where("role", "==", "ortu"),
);
export const siswas = createCollectionStore(
  "users",
  where("role", "==", "siswa"),
);
