class KeyMaps extends ClassArray<KeyMap> {

    jsObjectToClass(jsObject: any): Serializable<KeyMap> {
        return new KeyMap().fromJsObject(jsObject);
    }

    binaryToClass(buffer: UhkBuffer): Serializable<KeyMap> {
        return new KeyMap().fromBinary(buffer);
    }

}
