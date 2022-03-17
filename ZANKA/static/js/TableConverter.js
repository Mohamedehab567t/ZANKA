class TableConverterCSV{
    constructor(table , includeHeaders = true){
        this.table = table
        this.includeHeaders = includeHeaders
        this.rows = Array.from(table.querySelectorAll('tr'))
        if(!includeHeaders && this.rows[0].querySelectorAll("th").length){
            this.rows.shift()
        }
    }


    convertToCSV(){
        const lines = []
        const numCols = this._findTheLongestRow()

        for (const row of this.rows){
            let line = "";
            for(let i = 0; i < numCols; i++){
                if(row.children[i] !== undefined){
                    line += TableConverterCSV.parseCell(row.children[i])
                }

                line += (i !== (numCols - 1)) ? "," : ""
            }

            lines.push(line)
        }

        return lines.join("\n")
    }

    _findTheLongestRow(){
        return this.rows.reduce((l , row) => row.childElementCount > l ? row.childElementCount : l , 0)
    }

    static parseCell(tablecell){
        let parsedValue = tablecell.textContent

        // Replace all double quote with two double qoute
        parsedValue = parsedValue.replace(/"/g , `""`);

        // If value contain (new line , comma , double qoutes) enclose all of it with double qoute
        parsedValue = /[",\n]/.test(parsedValue) ? `"${parsedValue}"` : parsedValue

        return parsedValue
        }
}