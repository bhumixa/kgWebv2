import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Client } from 'elasticsearch-browser';
import { AfterViewInit, OnInit, OnDestroy, EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ElasticsearchService {
  perPage = environment.RESULTS_PER_PAGE;

  queryalldocs = {
    query: {
      match_all: {},
    },
    sort: [{ _score: { order: 'desc' } }],
  };
  private client;
  queryEmmiter: EventEmitter<any> = new EventEmitter();
  sortedSearch = [
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['GIA', 'HRD', 'FM','IGI','GSI','KG LAB', 'NGTC', 'DBCOO', 'NONE CERT']; doc['lab'].size() > 0 && order.indexOf(doc['lab'].value) >= 0 ? order.indexOf(doc['lab'].value) : Integer.MAX_VALUE",
        },
        order: 'asc',
      },
    },
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['ROUND', 'OVAL', 'CUSHION', 'CUSHION BRILLIANT', 'PEAR', 'PRINCESS', 'EMERALD', 'RADIANT', 'MARQUISE', 'HEART', 'ASSCHER', 'OLD EURO', 'OLD MINE', 'SQ EMERALD']; doc['ShapeCode'].size() > 0 && order.indexOf(doc['ShapeCode'].value) >= 0 ? order.indexOf(doc['ShapeCode'].value) : Integer.MAX_VALUE",
        },
        order: 'asc',
      },
    },
    {
      Size: {
        order: 'desc',
      },
    },
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['D','E','F','G','H','I','J','K','L','M','N','O','P','I-OWLB','J-OWLB','K-OWLB','L-OWLB','M-OWLB','N-OWLB','O-OWLB','P-OWLB','N-TTLB','O-TTLB','P-TTLB','K-TTLB','L-TTLB','M-TTLB','N-TLB','O-TLB','P-TLB','N-O','O-P','Q-R','S-T','U-V','W-X','Y-Z','UNASSORT','FANCY','Y','P-R','S-Z']; doc['ColorCode'].size() > 0 && order.indexOf(doc['ColorCode'].value) >= 0 ? order.indexOf(doc['ColorCode'].value) : Integer.MAX_VALUE",
        },
        order: 'asc',
      },
    },
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['FL','IF', 'VVS1', 'VVS2','VS1','VS2','SI1','SI2','SI3','I1+','I1','I-','I2++']; doc['ClarityCode'].size() > 0 && order.indexOf(doc['ClarityCode'].value) >= 0 ? order.indexOf(doc['ClarityCode'].value) : Integer.MAX_VALUE",
        },
        order: 'asc',
      },
    },
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['EXCL','VGOOD','GOOD','FAIR','POOR']; doc['CutCode'].size() > 0 &&  order.indexOf(doc['CutCode'].value) >= 0 ? order.indexOf(doc['CutCode'].value) : Integer.MAX_VALUE",
        },
        order: 'asc',
      },
    },
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['NONE','FAINT','MEDIUM','STRONG ','VERY STRONG']; doc['FluorescenceCode'].size() > 0 && order.indexOf(doc['FluorescenceCode'].value) >= 0 ? order.indexOf(doc['FluorescenceCode'].value) : Integer.MAX_VALUE",
        },
        order: 'asc',
      },
    },
  ];

  claritySortedAsc: any[] = [
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['FL','IF', 'VVS1', 'VVS2','VS1','VS2','SI1','SI2','SI3','I1+','I1','I-','I2++']; doc['ClarityCode'].size() > 0 && order.indexOf(doc['ClarityCode'].value) >= 0 ? order.indexOf(doc['ClarityCode'].value) : Integer.MAX_VALUE",
        },
        // order: 'asc',
      },
    },
  ];

  claritySortedDesc: any[] = [
    {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source:
            "def order = ['FL','IF', 'VVS1', 'VVS2','VS1','VS2','SI1','SI2','SI3','I1+','I1','I-','I2++']; doc['ClarityCode'].size() > 0 && order.indexOf(doc['ClarityCode'].value) >= 0 ? order.indexOf(doc['ClarityCode'].value) : Integer.MAX_VALUE",
        },
        order: 'desc',
      },
    },
  ];

  // claritySortedDesc: any[] = [
  //   {
  //     _script: {
  //       type: 'number',
  //       script: {
  //         lang: 'painless',
  //         source:
  //           "def order = ['I2++', 'I-', 'I1', 'I1+', 'SI3', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL']; doc['ClarityCode'].size() > 0 && order.indexOf(doc['ClarityCode'].value) >= 0 ? order.indexOf(doc['ClarityCode'].value) : Integer.MAX_VALUE",
  //       },
  //       order: 'desc',
  //     },
  //   },
  // ];

  constructor() {
    if (!this.client) {
      this.connect();
    }
  }

  createIndex(name): any {
    return this.client.indices.create(name);
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'Hello JOAC Search!',
    });
  }

  addToIndex(value): any {
    return this.client.create(value);
  }

  getAllDocuments(_query, _index?, _type?) {
    if (_index !== undefined) {
      if (_type !== undefined) {
        return this.client.search({
          q: _query,
          index: _index,
          type: _type,
          body: this.queryalldocs,
        });
      }
      return this.client.search({
        q: _query,
        index: _index,
        body: this.queryalldocs,
      });
    } else {
      if (_type !== undefined) {
        return this.client.search({
          q: _query,
          type: _type,
          body: this.queryalldocs,
        });
      }
      return this.client.search({
        q: _query,
        body: this.queryalldocs,
      });
    }
  }

  async getPaginatedDocuments(
    _query,
    _from,
    _index?,
    _type?,
    _perPage = this.perPage
  ) {
    /*
    if (!!_query.sort?.[0]) {
      const sortPara = Object.keys(_query.sort?.[0])[0];
      // if (sortPara === 'cts') {
      //   this.sortedSearch[2].Size.order = _query.sort[0].cts.order;
      // }
    }
    */

    const filterCriteria = !!_query?.sort ? _query.sort[0] : [];
    if (
      !!_query &&
      _query?.sort?.length === 1 &&
      Object.keys(filterCriteria)[0]?.toLowerCase() === 'claritycode'
    ) {
      if (filterCriteria.ClarityCode.order === 'asc') {
        _query.sort = this.claritySortedAsc;
      } else {
        _query.sort = this.claritySortedDesc;
      }
      // _query.sort = this.claritySorted;
    }

    if (_query?.sort?.length !== 1) {
      _query.sort = this.sortedSearch;
    }

    // if (_type === undefined) _query['size'] = 0;

    if (_index !== undefined) {
      if (_type !== undefined) {
        return this.client.search({
          body: _query,
          index: _index,
          type: _type,
          from: _from,
          size: _perPage,
        });
      }
      return this.client.search({
        body: _query,
        index: _index,
        from: _from,
        size: _perPage,
      });
    } else {
      if (_type !== undefined) {
        return this.client.search({
          body: _query,
          type: _type,
          from: _from,
          size: _perPage,
        });
      }
      return this.client.search({
        body: _query,
        from: _from,
        size: _perPage,
      });
    }
  }

  getNextPage(scroll_id): any {
    return this.client.scroll({
      scrollId: scroll_id,
      scroll: '1m',
    });
  }

  getObject(_id, _index, _type): any {
    if (_index !== undefined || _type !== undefined) {
      return this.client.get({
        index: _index,
        type: _type,
        id: _id,
      });
    } else {
      throw new Error(
        'Cannot query item with an undefined index or type or both.'
      );
    }
  }

  private connect() {
    this.client = new Client({
      host: environment.hosts,
      // log: 'trace'
    });
  }

  check_colorCode_fancy(
    fancyColor: string | null,
    fancyColorIntensity: string | null,
    fancyColorOvertone: string | null,
    color: string
  ): string {
    let colorCode = '';

    colorCode +=
      !!fancyColorIntensity && fancyColorIntensity?.toLowerCase() !== 'none'
        ? fancyColorIntensity
        : '';
    colorCode +=
      !!fancyColorOvertone && fancyColorOvertone?.toLowerCase() !== 'none'
        ? !!colorCode
          ? ' ' + fancyColorOvertone
          : fancyColorOvertone
        : '';
    colorCode +=
      !!fancyColor && fancyColor?.toLowerCase() !== 'none'
        ? !!colorCode
          ? ' ' + fancyColor
          : fancyColor
        : '';

    if (!colorCode) {
      colorCode = color;
    }

    return colorCode;
  }
}
