/**
 * Description 파싱 유틸리티
 * "(이쁜옷 #이쁜 #옷)" 형식에서 앞부분과 해시태그를 분리
 */

/**
 * Description을 파싱하여 텍스트와 태그를 분리
 * @param {string} description - "(이쁜옷 #이쁜 #옷)" 형식의 문자열
 * @returns {Object} { text: string, tags: string[] }
 */
export function parseDescription(description) {
  if (!description || typeof description !== 'string') {
    return { text: '', tags: [] };
  }

  // 괄호 제거
  const cleaned = description.trim().replace(/^\(|\)$/g, '');
  
  // 해시태그 추출 (#으로 시작하는 단어들)
  const tagRegex = /#(\S+)/g;
  const tags = [];
  let match;
  
  while ((match = tagRegex.exec(cleaned)) !== null) {
    tags.push(match[1]); // # 제거하고 태그만 추가
  }
  
  // 해시태그 제거하여 텍스트만 추출
  const text = cleaned.replace(/#\S+/g, '').trim();
  
  return {
    text: text || '',
    tags: tags,
  };
}

/**
 * Description에서 태그만 추출
 * @param {string} description - Description 문자열
 * @returns {string[]} 태그 배열
 */
export function extractTagsFromDescription(description) {
  const { tags } = parseDescription(description);
  return tags;
}

/**
 * Description에서 텍스트만 추출
 * @param {string} description - Description 문자열
 * @returns {string} 텍스트
 */
export function extractTextFromDescription(description) {
  const { text } = parseDescription(description);
  return text;
}

