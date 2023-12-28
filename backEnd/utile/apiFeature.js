
class apiFeature {
    constructor(query, queryStr) {
        // query is hold all data 
        this.query = query;
        // this.query is variable;
        this.queryStr = queryStr;

    }
    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
                //option is used to remove upper & lower case restic

            }
        } : {}
        this.query.find({ ...keyword })
        return this;
    }
    filter() {
        const queryStrCopy = { ...this.queryStr };

        //removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach((fieldPara) => { delete queryStrCopy[fieldPara] });

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr))
        return this;

    }
    // pagenitation(resPerPage) {
    //     const currentPage = Number(this.queryStr.page || 1)
    //     const skip = resPerPage * currentPage - 1;
    //     this.query.limit(resPerPage).skip(skip);
    //     return this;

    // } 
    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}
module.exports = apiFeature;  