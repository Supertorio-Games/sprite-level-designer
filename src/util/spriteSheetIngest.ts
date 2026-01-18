import {type sheetConfig } from '@/types';
import xmlToJson from '@/util/transformers/xmlToJson';

class SpriteSheetIngest {

    async  processSpriteSheet(spriteSheetInput:File, configInput:File ) : Promise<{spriteImageData: string, width: number, height: number, spriteImageConfig: sheetConfig}>
    {
        const spriteImageData = await this.readSpriteImage(spriteSheetInput);
        const spriteImageConfig = await this.readSpriteConfig(configInput);
        const spriteImageDimensions = await this.readSpriteImageSize(spriteSheetInput);

        if (spriteImageData && spriteImageConfig && spriteImageDimensions) {
            const [width, height] = spriteImageDimensions;
            return {
                spriteImageData, 
                width, 
                height, 
                spriteImageConfig
            };
        }
        return Promise.reject();
    }


    private readSpriteImage(spriteSheetInput:File) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;

            if (spriteSheetInput) {
                reader.readAsDataURL(spriteSheetInput);
            } else {
                reject();
            }
        });
    }

    private readSpriteImageSize(spriteSheetInput:File) : Promise<[number, number]> {
        return new Promise<[number, number]>((resolve, reject) => {
            let img = new Image();
            if (!spriteSheetInput) {
                reject();
                return;
            }
            const imgURL = window.URL.createObjectURL(spriteSheetInput);

            img.onload = () => {
                resolve([img.width, img.height]);
                URL.revokeObjectURL(imgURL);
            }
            img.onerror = () => {
                reject();
            }

            img.src = imgURL;
        });
    } 

    private readSpriteConfig(configInput:File): Promise<sheetConfig> {
        return new Promise<sheetConfig>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result as string;
                resolve(xmlToJson(text) as sheetConfig);
            }
            reader.onerror = reject;
            if (configInput) {
                reader.readAsText(configInput);
            } else {
                reject();
            }
        });
    }
}

export default SpriteSheetIngest;
