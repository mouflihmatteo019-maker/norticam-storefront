// Keep the omission rules in sync with product-description.ts; parity is covered by tests.
const uncertainty = [
  'non précisé', 'non precise', 'non documenté', 'non documente', 'non communiqué',
  'non communique', 'non renseigné', 'non renseigne', 'à confirmer', 'a confirmer',
  'faites confirmer', 'demandez-nous confirmation', 'génération livrée', 'generation livree',
  'version livrée', 'version livree', 'référence livrée', 'reference livree',
  'selon la version', 'selon version', 'de la version proposée', 'selon la génération', 'selon la generation',
  'd6wl ou d6rl', 'd6wl/d6rl', 'd6wl / d6rl', 'd6wl d6rl', 'confirmez le nombre de caméras',
  'confirmez le nombre de cameras', 'confirmer le nombre de caméras',
  'vérifiez le nombre de caméras', 'vérifiez le nombre de canaux',
  'confirmer les accessoires', 'accessoires inclus à vérifier',
  'vérifiez la référence exacte', 'vérifiez la référence d6wl',
  'les accessoires inclus et les capacités de la caméra arrière doivent être vérifiés',
];
const blockTags = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'blockquote'];

/** Capture this snippet for HTML, text (mode: 'text') or product title (mode: 'title'). */
export function productDescriptionLiquid() {
  const markBlocks = blockTags.map(tag => ` | replace: '<${tag}>', '␞NORTICAM_BLOCK␞<${tag}>' | replace: '<${tag} ', '␞NORTICAM_BLOCK␞<${tag} '`).join('');
  const spaceBlocks = blockTags.map(tag => ` | replace: '</${tag}>', ' '`).join('') + " | replace: '<br>', ' ' | replace: '<br/>', ' ' | replace: '<br />', ' '";
  return `{%- if mode == 'title' -%}
  {{- description | replace: 'D6WL/D6RL', '' | replace: 'D6WL / D6RL', '' | replace: 'D6WL ou D6RL', '' | replace: 'D6WL D6RL', '' | replace: 'd6wl/d6rl', '' | replace: 'd6wl / d6rl', '' | replace: 'd6wl ou d6rl', '' | replace: 'd6wl d6rl', '' | replace: '  ', ' ' | strip -}}
{%- elsif mode == 'text' -%}
  {%- assign omission_rules = ${JSON.stringify(uncertainty.join('|'))} | split: '|' -%}
  {%- assign product_key = product.id | append: '' | split: '/' | last -%}
  {%- if product_key == '16413273293149' -%}{%- assign model_rules = 'wi-fi 6|wi‑fi 6|supercondensateur|fonctions gps|gps intégré' | split: '|' -%}{%- assign omission_rules = omission_rules | concat: model_rules -%}{%- endif -%}
  {%- assign sentence_source = description${spaceBlocks} | strip_html | replace: '&nbsp;', ' ' | replace: '&#160;', ' ' | strip | replace: '. ', '.␞NORTICAM_SENTENCE␞' | replace: '? ', '?␞NORTICAM_SENTENCE␞' | replace: '! ', '!␞NORTICAM_SENTENCE␞' | replace: '; ', ';␞NORTICAM_SENTENCE␞' | newline_to_br | replace: '<br />', '␞NORTICAM_SENTENCE␞' -%}
  {%- assign sentences = sentence_source | split: '␞NORTICAM_SENTENCE␞' -%}
  {%- assign first_sentence = true -%}
  {%- for sentence in sentences -%}
    {%- assign sentence_text = sentence | strip -%}
    {%- assign comparable = sentence_text | downcase -%}
    {%- assign omit = false -%}
    {%- for rule in omission_rules -%}{%- if comparable contains rule -%}{%- assign omit = true -%}{%- break -%}{%- endif -%}{%- endfor -%}
    {%- unless omit or sentence_text == blank -%}{%- unless first_sentence -%}{{- ' ' -}}{%- endunless -%}{{- sentence_text -}}{%- assign first_sentence = false -%}{%- endunless -%}
  {%- endfor -%}
{%- else -%}
  {%- assign marked_html = description${markBlocks} -%}
  {%- assign blocks = marked_html | split: '␞NORTICAM_BLOCK␞' -%}
  {%- assign pending_heading = '' -%}
  {%- capture cleaned_html -%}
    {%- for block_part in blocks -%}
      {%- assign opening = block_part | split: '>' | first | append: '>' -%}
      {%- assign tag = opening | remove_first: '<' | remove: '>' | split: ' ' | first -%}
      {%- assign closing = '</' | append: tag | append: '>' -%}
      {%- assign has_closing = false -%}{%- if block_part contains closing -%}{%- assign has_closing = true -%}{%- endif -%}
      {%- if forloop.first or has_closing == false -%}
        {{- block_part -}}
      {%- else -%}
        {%- assign rest = block_part | remove_first: opening -%}
        {%- assign inner = rest | split: closing | first -%}
        {%- assign tail = rest | remove_first: inner | remove_first: closing -%}
        {%- assign original_text = inner | strip_html | replace: '&nbsp;', ' ' | replace: '&#160;', ' ' | strip -%}
        {%- capture clean_text -%}{%- render 'norticam-product-description', description: inner, mode: 'text', product: product -%}{%- endcapture -%}
        {%- capture clean_block -%}
          {%- if clean_text != blank -%}{{- opening -}}{%- if clean_text == original_text -%}{{- inner -}}{%- else -%}{{- clean_text | replace: '<', '&lt;' | replace: '>', '&gt;' -}}{%- endif -%}{{- closing -}}{%- endif -%}
        {%- endcapture -%}
        {%- assign heading_tags = 'h1|h2|h3|h4|h5|h6' | split: '|' -%}
        {%- if heading_tags contains tag -%}
          {%- assign pending_heading = clean_block | append: tail -%}
        {%- else -%}
          {%- if clean_block != blank -%}
            {{- pending_heading -}}{{- clean_block -}}{{- tail -}}{%- assign pending_heading = '' -%}
          {%- elsif pending_heading != blank -%}
            {%- assign pending_heading = pending_heading | append: tail -%}
          {%- else -%}
            {{- tail -}}
          {%- endif -%}
        {%- endif -%}
      {%- endif -%}
    {%- endfor -%}
  {%- endcapture -%}
  {%- assign list_tags = 'ul|ol' | split: '|' -%}
  {%- for list_tag in list_tags -%}
    {%- assign opening_list = '<' | append: list_tag | append: '>' -%}
    {%- assign closing_list = '</' | append: list_tag | append: '>' -%}
    {%- assign list_parts = cleaned_html | append: '␞NORTICAM_END␞' | split: closing_list -%}
    {%- capture pruned_html -%}
      {%- for list_part in list_parts -%}
        {%- if forloop.last -%}{{- list_part | remove: '␞NORTICAM_END␞' -}}
        {%- elsif list_part contains opening_list -%}
          {%- assign list_content = list_part | split: opening_list | last | strip_html | strip -%}
          {%- if list_content == blank -%}{{- list_part | split: opening_list | first -}}
          {%- else -%}{{- list_part -}}{{- closing_list -}}{%- endif -%}
        {%- else -%}{{- list_part -}}{{- closing_list -}}{%- endif -%}
      {%- endfor -%}
    {%- endcapture -%}
    {%- assign cleaned_html = pruned_html -%}
  {%- endfor -%}
  {{- cleaned_html | strip -}}
{%- endif -%}`;
}
