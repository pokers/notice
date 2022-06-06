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

class KeywordModel extends Model {
    public id!: number;
    public username: string;
    public keyword: string;
    
    static initialize(sequelize:Sequelize){
        this.init({
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            username: {
                type: STRING
            },
            keyword: {
                type: STRING
            }
        },{
            sequelize: sequelize,
            modelName: 'KeywordModel',
            tableName: 'keyword',
            timestamps: false,
            paranoid: true,
        });
        this.sync();

        return this;
    }
}

export { KeywordModel }
    