import * as _ from 'lodash';

export class Profile {
    name: String
    age: Number
    phone: String
    mail: String
    avatar: String
    description: String
    school: String
    tags: String[]
    job: String

    constructor(json: Object) {
        this.name = _.get(json, 'name', '');
        this.age = _.get(json, 'age', 0);
        this.phone = _.get(json, 'phone', '');
        this.mail = _.get(json, 'mail', '');
        this.school = _.get(json, 'school', '');
        this.avatar = _.get(json, 'avatar', '../../img/default_avatar.jpg');
        this.description = _.get(json, 'description', '');
        this.tags = _.get(json, 'tags', '').split(',');
        this.job = _.get(json, 'job', '');
    }
}