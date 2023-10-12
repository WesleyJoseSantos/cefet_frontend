const file = await fetch('js/env.prod.json')

const obj = await file.json()

const env = {
    ENV: obj.ENV ?? "",
    API: obj.API ?? ""
}

export default env