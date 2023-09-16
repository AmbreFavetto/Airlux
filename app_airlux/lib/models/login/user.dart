class Device {
  Device({this.name, this.password, this.email, this.forename});
  String? name;
  String? forename;
  String? password;
  String? email;

  Device.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    forename = json['forename'];
    email = json['email'];
    password = json['password'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = name;
    data['forename'] = forename;
    data['email'] = email;
    data['password'] = password;

    return data;
  }
}

