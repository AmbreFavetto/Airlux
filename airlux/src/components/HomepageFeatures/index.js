import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'API',
    Svg: require('@site/static/img/api.svg').default,
    description: (
      <>
        Le projet Airlux utilise 2 API pour fonctionner. Une permettant d'utiliser l'application localement et une autre à distance.
      </>
    ),
  },
  {
    title: 'Bases de données',
    Svg: require('@site/static/img/bd.svg').default,
    description: (
      <>
        Le projet Airlux utilise 2 bases de données. Une base de données <b>Redis</b> pour le stockage des données localement et une base de données <b>Mysql</b> pour le stockage des données à distance.
      </>
    ),
  },
  {
    title: 'Application Flutter',
    Svg: require('@site/static/img/logo_flutter.svg').default,
    description: (
      <>
        L'application Airlux utilise le framework Flutter. Cela permet qu'elle soit utilisable facilement à la fois sur IOS et sur Android.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
