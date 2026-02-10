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
    SubTexture: sheetTexture[];
}

export interface subTexture {
    
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
}

export enum LayerType { "physics", "tile", "background" };

export interface mapLayer {
    _id: number;
    _type: LayerType,
    _interactable: Boolean,
    title: string;
    enabled: Boolean;
    icon: string;
    stacking: number;
}


export interface blockData {
    _id: number;
    hasCollision: boolean;
    hasPhysics: boolean;
    isStatic: boolean;
    tags: string[];
}

export type sheetTexture =  subTexture & blockData;

export type kaplaySpriteAtlasConfig = {
    imageURL: string;
    sprites: subTexture[];
}
