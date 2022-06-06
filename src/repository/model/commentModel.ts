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

class CommentModel extends Model {
    public id!: number;
    public articleId: number;
    public parentId?: number|null;
    public content: string;
    public username: string;
    public createdAt!: string;

    static initialize(sequelize:Sequelize){
        this.init({
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            articleId:{
                type: INTEGER,
            },
            parentId: {
                type: INTEGER,
                allowNull: true
            },
            content: {
                type: TEXT
            },
            username: {
                type: STRING
            },
            createdAt:{
                type: DATE,
            }
        },{
            sequelize: sequelize,
            modelName: 'CommentModel',
            tableName: 'comment',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}
CommentModel.findAll
export { CommentModel }
    