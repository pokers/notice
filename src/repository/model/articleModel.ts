import { DataTypes, Model, Sequelize } from '../../lib/sequelizeORM';
const {
    INTEGER,
    STRING,
    BOOLEAN,
    DATE,
    DATEONLY,
    UUID,
    UUIDV1,
    ENUM,
    TEXT,
} = DataTypes;

class ArticleModel extends Model {
    public id!: number;
    public title: string;
    public content?: string;
    public username: string;
    public passwd: string;
    public createdAt!: string;
    public updatedAt: string;

    static initialize(sequelize:Sequelize){
        this.init({
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: STRING
            },
            content: {
                type: TEXT,
                allowNull: true
            },
            username: {
                type: STRING
            },
            passwd: {
                type: STRING
            },
            createdAt:{
                type: DATE,
            },
            updatedAt:{
                type: DATE,
            }
        },{
            sequelize: sequelize,
            modelName: 'ArticleModel',
            tableName: 'article',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { ArticleModel }
    