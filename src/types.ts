
export type cellPos = {
    row: number, 
    col: number
};

export type mapCell = {
    sprite: [number, number] | null;
}

export type spriteSheet = {
    _id: number;
    imageData: string;
    width: number;
    height: number;
    config: sheetConfig;
}

export type sheetConfig = {
    imagePath: string;
    SubTexture: subTexture[];
}

export type subTexture = {
    _id: number;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
}

export type kaplaySpriteAtlasConfig = {
    imageURL: string;
    sprites: subTexture[];
}
