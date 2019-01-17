from search.extraction.synonyms.data import SYNONYMS


filters = {
    # Normalize acronyms so that no matter the format, the resulting token will be the same.
    # E.g.: SmiC => S.M.I.C. => SMIC => smic.
    'french_acronyms': {
        'type': 'word_delimiter',
        'catenate_all': True,
        'generate_word_parts': False,
        'generate_number_parts': False,
    },
    # Remove elision (l'avion => avion)
    # ne prend pas en compte la casse (L'avion = l'avion = avion)
    'french_elision': {
        'type': 'elision',
        'articles_case': True,
        'articles': [
            'l',
            'm',
            't',
            'qu',
            'n',
            's',
            'j',
            'd',
            'c',
            'jusqu',
            'quoiqu',
            'lorsqu',
            'puisqu',
            'parce qu',
            'parcequ',
            'entr',
            'presqu',
            'quelqu',
        ],
    },
    # liste de termes et leurs synonymes
    'french_synonyms': {
        'type': 'synonym',
        'ignore_case': True,
        'expand': True,
        'synonyms': SYNONYMS,
    },
    # Il existe 3 stemmer pour le francais french, light_french, minimal_french
    # light french et le median
    'french_stemmer': {
        'type': 'stemmer',
        'language': 'light_french',
    },
    'french_stop': {
        'type': 'stop',
        'stopwords': '_french_',
    },
    'shingle': {
        'type': 'shingle',
        'min_shingle_size': 2,
        'max_shingle_size': 5,
        'output_unigrams': False,
        'filler_token': '',
    },
}

analyzers = {
    'idcc_ape': {
      'tokenizer': 'whitespace',
      'filters': [
        'french_acronyms'
      ]
    },
    'french_heavy': {
      'tokenizer': 'icu_tokenizer',
      'filters': [
        'french_elision',
        'icu_folding',
        'french_stemmer',
        'french_synonyms'
      ]
    },
    'french_light': {
      'tokenizer': 'icu_tokenizer',
      'filters': [
        'french_elision',
        'icu_folding',
        'french_synonym'
      ]
    },
    'french_stemmed': {
        'type': 'custom',
        'char_filter': ['html_strip'],
        'tokenizer': 'icu_tokenizer',
        'filter': [
            'french_elision',
            'icu_folding',
            'lowercase',
            'french_acronyms',
            'french_synonyms',
            'french_stop',
            'french_stemmer',
        ],
    },
    'french_exact': {
        'type': 'custom',
        'char_filter': ['html_strip'],
        'tokenizer': 'icu_tokenizer',
        'filter': [
            'french_elision',
            'icu_folding',
            'lowercase',
            'french_acronyms',
            'french_synonyms',
            'french_stop',
        ],
    },
    'shingle': {
        'type': 'custom',
        'char_filter': ['html_strip'],
        'tokenizer': 'icu_tokenizer',
        'filter': [
            'french_elision',
            'icu_folding',
            'lowercase',
            'french_acronyms',
            'french_synonyms',
            'french_stop',
            'shingle',
        ],
    },
    'path_analyzer_custom': {
        'tokenizer': 'tags',
    },
}

tokenizers = {
    'tags': {
        'type': 'path_hierarchy',
    },
}
