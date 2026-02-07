import type { kaplaySpriteAtlasConfig, mapCell, sheetTexture, spriteSheet } from "@/types";
import { MAP_SPRITE_IDS } from "@/config";
import { prefixMethodName } from "./exportUtils";

export interface kaplayExportOptions {
    baseTileSize: number,
    outputSpritePath: string,
    kaplayOptPrefix: string
}

// TODO: Localize and Expand on the code commenting
export const CODE_PREFIX_COMMENT = `// Level Definition and Config for use in the KaplayJS game framework \n`;

export const parseMapGridForExport = (mapGrid: mapCell[][], mapWidth: number, mapHeight: number) => {
    const usedSpriteKeys = new Array<string>();
    const usedSpriteValues: Record<string, [number, number]> = {};
    let asciMap: string[] = [];

    for (let r = 0; r < mapHeight; r++) {
        let rowString = '';
        if (mapGrid.length <= r) continue;

        for (let c = 0; c < mapWidth; c++) {
            if (mapGrid[r].length <= c) continue;
            
            const cell = mapGrid[r][c];
            if (cell.sprite) {
                const key = `${cell.sprite[0]}_${cell.sprite[1]}`;
                const usedIndex = usedSpriteKeys.indexOf(key);

                if (usedIndex < 0 ) {
                    usedSpriteKeys.push(key);
                    const identifier = MAP_SPRITE_IDS[usedSpriteKeys.length - 1];
                    usedSpriteValues[identifier] = [cell.sprite[0], cell.sprite[1]];
                    rowString += identifier;
                } else {
                    const identifier = MAP_SPRITE_IDS[usedIndex];
                    rowString += identifier;
                }

            } else {
                rowString += ' ';
            }
        }
        asciMap.push(rowString);
    }

    return {
        asciMap,
        spriteMapKeys: usedSpriteValues
    }
}

export const parseSpriteSheetsForExport = (spriteSheets: spriteSheet[], spriteMapKeys: Record<string, [number, number]>) => {

    const spriteMapConfigs: Record<string, kaplaySpriteAtlasConfig> = {};

    Object.keys(spriteMapKeys).forEach(key => {
        const sheetIndex = spriteMapKeys[key][0].toString();
        const spriteIndex = spriteMapKeys[key][1];
        const sheetData = spriteSheets[spriteMapKeys[key][0]]

        if (!spriteMapConfigs[sheetIndex]) {

            spriteMapConfigs[sheetIndex] = {
                imageURL: sheetData.config.imagePath,
                sprites: []
            };
        }

        const subTexture = sheetData.config.SubTexture[spriteIndex];
        spriteMapConfigs[sheetIndex].sprites.push(subTexture);
    });

    return spriteMapConfigs;
};


export const formatSpriteAtlasConfig = (config: Record<string, kaplaySpriteAtlasConfig>, options: kaplayExportOptions) :string => {
    let output = '';

    Object.keys(config).forEach(key => {
        const sheetConfig = config[key];

        output += `${prefixMethodName('loadSpriteAtlas', options.kaplayOptPrefix)}("${options.outputSpritePath}${sheetConfig.imageURL}", {\n`;
        sheetConfig.sprites.forEach(sprite => {
            output +=  `    ${sprite.name}: {\n`+
                       `      x: ${sprite.x},\n`+
                       `      y: ${sprite.y},\n`+
                       `      width: ${sprite.width},\n`+
                       `      height: ${sprite.height},\n`+
                       `    },\n`;
        });
        output += `});\n\n`;

    });

    return output;
}

export const formatLevelMap = (asciMap: string[]) :string => {
    let output = `const levelMap = [\n`;
    asciMap.forEach(row => {
        output += `  "${row}",\n`;
    });
    output += `];\n\n`;

    return output;
}

const addPhysicsComponent = (prefix: string, isStatic = false) => {
    const staticCode = isStatic ? `{ isStatic: true }` : '';
    return `${prefixMethodName('body', prefix)}(${staticCode})`;
};


export const formatLevelConfig = (spriteMapKeys: Record<string, [number, number]>, spriteSheets: spriteSheet[], options:kaplayExportOptions): string => {

    const formatConfigSprite = (asciKey:string, details: sheetTexture) => {

        let spriteOutput =                          `        "${asciKey}": () => [\n` +
                                                    `            ${prefixMethodName('sprite', options.kaplayOptPrefix)}("${details.name}"),\n`;
        if (details.hasCollision) spriteOutput +=   `            ${prefixMethodName('area', options.kaplayOptPrefix)}(),\n`;
        if (details.hasPhysics) spriteOutput +=     `            ${addPhysicsComponent(options.kaplayOptPrefix, details.isStatic)},\n`;
        
        details.tags.forEach(tag => {
            spriteOutput +=                         `            "${tag}",\n`;
        });
        spriteOutput +=                     `        ],\n`;
        return spriteOutput;
    }

    let output = `const levelConfig = {\n` + 
                 `    tileWidth: ${options.baseTileSize},\n` +
                 `    tileHeight: ${options.baseTileSize},\n` + 
                 `    tiles: {\n`;
    
    Object.keys(spriteMapKeys).forEach(key => {
        const sheetIndex = spriteMapKeys[key][0];
        const spriteIndex = spriteMapKeys[key][1];
        const spriteConfig = spriteSheets[sheetIndex].config.SubTexture[spriteIndex];
        output += formatConfigSprite(key, spriteConfig);
    });

    output += `    }\n` + 
              `};\n\n`;

    return output;
};

export const formatAddLevelConfig = (options: kaplayExportOptions) => {
    return `${prefixMethodName('addLevel', options.kaplayOptPrefix)}(levelMap, levelConfig);\n\n`
};

