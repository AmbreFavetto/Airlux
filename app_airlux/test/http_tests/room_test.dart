import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void roomTest() {
  String route = 'http://10.0.2.2:3000/room';

  test('Get all rooms ok', () async {
    final response = await http.get(Uri.parse(route));
    expect(response.statusCode, 200);
  });

  test('Get room by id ok', () async {
    int id = 1;
    final response = await http.get(Uri.parse(route, id));
    expect(response.statusCode, 200);
  });

  test('Get all rooms not allowed', () async {
    final response = await http.get(Uri.parse(route + 'error'));
    expect(response.statusCode, 405);
  });

  test('Delete room ok', () async {
    String id = 1.toString();
    final response = await http.delete(Uri.parse(route + '/' + id));
    expect(response.statusCode, 200);
  });
}