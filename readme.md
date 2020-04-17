![phaser3-parceljs-template](https://user-images.githubusercontent.com/2236153/71606463-37a0da80-2b2e-11ea-9b5f-5d26ccc84f91.png)

# Phaser3 + Parcel Template

> For people who want to spend time making games instead of configuring build tools.

![License](https://img.shields.io/badge/license-MIT-green)

```

## Getting Started


Start development server:

```

npm run start

```

To create a production build:

```

npm run build

```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

## Project Structure

```

    .
    ├── dist
    ├── node_modules
    ├── public
    ├── src
    │   ├── scenes
    │   │   ├── index.js
    │   │   ├── Preload.js
    │   │   ├── Menu.js
    │   │   ├── Settings.js
    │   │   ├── Game.js
    │   │   ├── GameOver.js
    │   ├── index.html
    │   ├── main.js
    ├── package.json

```

## Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served at http://localhost:8000/images/my-image.png

Example `public` structure:

```

    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...

```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.

## TypeScript

It just works. (Thanks to Parcel)

You can rename all the `.js` files to `.ts` and start using TypeScript.

You may also want to add a `tsconfig.json` file to the project root like this:

```

{
"compilerOptions": {
"target": "es2016",
"module": "es6",
"strict": true,
"noImplicitAny": false,
"noEmit": true,
"allowJs": true,
"jsx": "preserve",
"importHelpers": true,
"moduleResolution": "node",
"experimentalDecorators": true,
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
"sourceMap": true,
"baseUrl": "./src",
"paths": {
"~/_": ["./_"]
},
"typeRoots": [
"node_modules/@types",
"node_module/phaser/types"
],
"types": [
"phaser"
]
},
"include": [
"src/**/*"
]
}

```

[More information on `tsconfig.json` options here.](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

[Note on how Parcel handles `baseUrl` and `paths`.](https://gist.github.com/croaky/e3394e78d419475efc79c1e418c243ed)

## Dev Server Port

You can change the dev server's port number by modifying the `start` script in `package.json`. We use Parcel's `-p` option to specify the port number.

The script looks like this:

```

parcel src/index.html -p 8000

```

Change 8000 to whatever you want.

## Other Notes

[parcel-plugin-clean-easy](https://github.com/lifuzhao100/parcel-plugin-clean-easy) is used to ensure only the latest files are in the `dist` folder. You can modify this behavior by changing `parcelCleanPaths` in `package.json`.

[parcel-plugin-static-files](https://github.com/elwin013/parcel-plugin-static-files-copy#readme) is used to copy static files from `public` into the output directory and serve it. You can add additional paths by modifying `staticFiles` in `package.json`.

## License

[MIT License](https://github.com/ourcade/phaser3-parcel-template/blob/master/LICENSE)
```
