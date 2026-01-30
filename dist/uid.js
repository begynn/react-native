import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "@begynn/uid";
const generateUUID = () => {
    const cryptoObj = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
    if (cryptoObj?.randomUUID) {
        return cryptoObj.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
export const getOrCreateUID = async () => {
    try {
        const storedUid = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUid) {
            return storedUid;
        }
    }
    catch { }
    const newUid = generateUUID();
    try {
        await AsyncStorage.setItem(STORAGE_KEY, newUid);
    }
    catch { }
    return newUid;
};
//# sourceMappingURL=uid.js.map