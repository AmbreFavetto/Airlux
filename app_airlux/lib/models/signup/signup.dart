class Signup{
  Signup({this.name, this.password, this.email, this.forename, this.is_admin});
  String? name;
  String? forename;
  String? password;
  String? email;
  int? is_admin;

  Signup.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    forename = json['forename'];
    email = json['email'];
    password = json['password'];
    is_admin = json['is_admin'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = name;
    data['forename'] = forename;
    data['email'] = email;
    data['password'] = password;
    data['is_admin'] = is_admin;

    return data;
  }
}