export default function process(batch){
    const list = [];
        batch.forEach(element => {
        let result= { code: null, description: null};
        result.code = Number(element[0]);
        result.description = element[1];
        list.push(result)
    });
    addToDatabase(list)


}

function addToDatabase(list){
    console.log("adionado no banco com sucesso")
}