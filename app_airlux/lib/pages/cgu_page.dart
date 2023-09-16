import 'package:app_airlux/cgu.dart';
import 'package:flutter/material.dart';

class CguPage extends StatelessWidget {
  const CguPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white.withOpacity(0),
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Colors.black,
            size: 30,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(12.0),
          child: const Column(children: [
            Text(
              'Conditions Générales d\’Utilisation de l\'application mobile Airlux',
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 25.0,
                decoration: TextDecoration.underline,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 40),
            ArticleStyle(
                title:
                'ARTICLE 1 – OBJET DES CONDITIONS GÉNÉRALES D\’UTILISATION',
                text: kArticle1),
            ArticleStyle(
                title: 'ARTICLE 2 – OBJET ET FONCTIONNALITÉS DE L\’APPLICATION',
                text: kArticle2),
            ArticleStyle(
              title: 'ARTICLE 3 - ACCÈS À L\’APPLICATION',
              text: kArticle3,
            ),
            ArticleStyle(
              title: 'ARTICLE 4 – LICENCE D\’UTILISATION',
              text: kArticle4,
            ),
          ]),
        ),
      ),
    );
  }
}

class ArticleStyle extends StatelessWidget {
  const ArticleStyle({
    Key? key,
    required this.title,
    required this.text,
  }) : super(key: key);

  final String title;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Text(
        title,
        style: const TextStyle(
          fontSize: 20.0,
          fontWeight: FontWeight.w400,
        ),
        textAlign: TextAlign.left,
      ),
      const SizedBox(height: 13),
      Text(
        text,
        style: const TextStyle(
          fontSize: 17.0,
          fontWeight: FontWeight.w200,
        ),
        textAlign: TextAlign.justify,
      ),
      const SizedBox(height: 30),
    ]);
  }
}
