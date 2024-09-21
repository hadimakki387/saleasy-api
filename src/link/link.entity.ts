import { MainEntity } from 'src/main-classes/mainEntity';
import { StoreEntity } from 'src/store/store.entity';
import { Column, Entity, OneToOne } from 'typeorm';

export enum sectionsTypes {
  deals_of_the_day = 'deals_of_the_day',
  manually_selected = 'manually_selected',
  category_related = 'category_related',
}
@Entity('links')
export class LinkEntity extends MainEntity {
  @Column('jsonb', { nullable: false })
  header: {
    links: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
    logo: string;
    logoSize: number;
    shippingFee: string;
  };

  @Column('jsonb', { nullable: false })
  Hero: {
    Carousel: {
      id: string;
      text1: string;
      text2: string;
      text3: string;
      text4: string;
      backgroundImage: string;
      link: {
        title: string;
        target: string;
      };
    }[];
    sideBoxes: {
      id: string;
      backgroundImage: string;
      text1: string;
      text2: string;
      text3: string;
      link: {
        title: string;
        target: string;
      };
    }[];
  };

  @Column('jsonb', { nullable: false })
  categoryItems: string[];

  @Column('jsonb', { nullable: false })
  sections: {
    id: string;
    title: string;
    categoryId: string;
    items: string[];
    type: sectionsTypes;
    advertisementSection: {
      backgroundImage: string;
      id: string;
      text1: string;
      text2: string;
      redText: string;
      link: {
        title: string;
        target: string;
      };
    }[];
  }[];

  @Column('jsonb', { nullable: false })
  footer: {
    descriptionText: string;
  };

  @OneToOne(() => StoreEntity, (store) => store.link)
  store: StoreEntity;
}
const defaultHeader = {
  links: {
    instagram: '',
    facebook: '',
    twitter: '',
  },
  logo: '7c732995-436b-44cc-953c-eb986dc8e5ed',
  shippingFee: 'Free Express Shipping',
};
const defaultHero = {
  Carousel: [
    {
      id: '1',
      text1: 'LIFESTYLE COLLECTION',
      text2: 'MEN',
      text3: 'SALE UP TO',
      text4: '30% OFF',
      backgroundImage: '7990afbc-56cc-4427-bbde-b04735bae70c',
      link: {
        title: 'SHOP NOW',
        target: '',
      },
    },
  ],
  sideBoxes: [
    {
      id: '1',
      backgroundImage: '96a2c92f-0dee-4b59-b158-cc7038739964',
      text1: 'NEW ARRIVALS',
      text2: 'SUMMER',
      text3: 'SALE 20% OFF',
      link: {
        title: 'more proucts',
        target: '',
      },
    },
    {
      id: '2',
      backgroundImage: '3284596c-1b36-496e-8e60-d53a8a186237',
      text1: 'NEW ARRIVALS',
      text2: 'SUMMER',
      text3: 'SALE 20% OFF',
      link: {
        title: 'more proucts',
        target: '',
      },
    },
  ],
};
const defaultCategoryItems = [];
const defaultSections = [
  {
    id: '1',
    title: '',
    categoryId: '',
    type: sectionsTypes.deals_of_the_day,
    advertisementSection: [
      {
        id: '1',
        text1: '',
        text2: '',
        redText: '',
        link: {
          title: '',
          target: '',
        },
      },
    ],
    items: null,
  },
  {
    id: '2',
    title: '',
    categoryId: '',
    type: sectionsTypes.manually_selected,
    items: [],
    advertisementSection: null,
  },
  {
    id: '3',
    title: '',
    categoryId: 'e3771f0d-19f8-4213-b0cd-5871bca515be',
    type: sectionsTypes.category_related,
    items: null,
    advertisementSection: null,
  },
];
const defaultFooter = {
  descriptionText: '',
};
export const allDefault = {
  header: defaultHeader,
  Hero: defaultHero,
  categoryItems: defaultCategoryItems,
  sections: defaultSections,
  footer: defaultFooter,
};
