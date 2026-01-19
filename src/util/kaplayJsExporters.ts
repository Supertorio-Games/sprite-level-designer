import type { kaplaySpriteAtlasConfig, mapCell, spriteSheet } from "@/types";
import { MAP_SPRITE_IDS } from "@/config";

// TODO: Localize and Expand on the code commenting
export const CODE_PREFIX_COMMENT = `// Level Definition and Config for use in the KaplayJS game framework \n`;
export const ADD_LEVEL_CODE = `addLevel(levelMap, levelConfig);\n\n`

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


export const formatSpriteAtlasConfig = (config: Record<string, kaplaySpriteAtlasConfig>) :string => {
    let output = '';

    Object.keys(config).forEach(key => {
        const sheetConfig = config[key];

        output += `loadSpriteAtlas("${sheetConfig.imageURL}", {\n`;
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

export const formatLevelConfig = (spriteMapKeys: Record<string, [number, number]>, spriteSheets: spriteSheet[]): string => {

    const formatConfigSprite = (asciKey:string, name: string, collisions = false, solid = false, tags: string[] = []) => {

        let spriteOutput = `        "${asciKey}": () => [\n` +
                           `            sprite("${name}"),\n` +
                           `            origin("bot"),\n`;

        if (collisions) spriteOutput += `            area(),\n`;
        if (solid) spriteOutput += `            body(),\n`;
        
        tags.forEach(tag => {
            spriteOutput += `            "${tag}",\n`;
        });

        spriteOutput += `        ],\n`;
        return spriteOutput;
    }

    let output = `const levelConfig = {\n` + 
                 `    tileWidth: 32,\n` +
                 `    tileHeight: 32,\n` + 
                 `    tiles: {\n`;
    
    Object.keys(spriteMapKeys).forEach(key => {
        const sheetIndex = spriteMapKeys[key][0];
        const spriteIndex = spriteMapKeys[key][1];
        const spriteConfig = spriteSheets[sheetIndex].config.SubTexture[spriteIndex];
        output += formatConfigSprite(key, spriteConfig.name, true);
    });

    output += `    }\n` + 
              `};\n\n`;

    return output;
};
