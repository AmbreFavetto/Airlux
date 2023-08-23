class Building {
  Building({required this.name,  required this.id});
  String name = 'name';
  String id = '0';

  Building.fromJson(Map<String, dynamic> json) {
    id = json['building_id'];
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    return data;
  }
}