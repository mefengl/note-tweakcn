// 导入 useSWR Hook，这是一个用于数据请求的 React Hooks 库，支持缓存、重新验证等功能。
import useSWR from "swr";

// 定义 GitHub API 响应中我们关心的部分的数据结构。
// stargazers_count 是 GitHub API 返回的表示仓库 Star 数量的字段。
interface GitHubStarsResponse {
  stargazers_count: number;
}

/**
 * 异步函数，用于从 GitHub API 获取指定仓库的 Star 数量。
 * 
 * @param owner - 仓库拥有者的用户名或组织名。
 * @param repo - 仓库的名称。
 * @returns 返回一个 Promise，解析为包含 stargazers_count 的对象。
 * @throws 如果 API 请求失败（例如网络错误或仓库不存在），则抛出错误。
 */
async function fetchGithubStars(
  owner: string,
  repo: string
): Promise<GitHubStarsResponse> {
  // 构建 GitHub API 的 URL。
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  // 检查 HTTP 响应状态码是否表示成功 (例如 200 OK)。
  if (!response.ok) {
    // 如果响应不成功，抛出一个错误。
    throw new Error("Failed to fetch stargazers count");
  }
  // 如果响应成功，将响应体解析为 JSON 对象并返回。
  return response.json();
}

/**
 * 自定义 React Hook: useGithubStars
 * 
 * 这个 Hook 使用 useSWR 来获取并缓存指定 GitHub 仓库的 Star 数量。
 * 
 * @param owner - 仓库拥有者的用户名或组织名 (string)。
 * @param repo - 仓库的名称 (string)。
 * @returns 返回一个包含以下内容的对象：
 *   - `stargazersCount` (number): 获取到的 Star 数量，如果正在加载或发生错误，则为 0。
 *   - `isLoading` (boolean): 表示数据是否正在加载中。
 *   - `error` (Error | null): 如果在获取数据过程中发生错误，则为错误对象，否则为 null。
 */
export function useGithubStars(owner: string, repo: string) {
  // 调用 useSWR Hook。
  // - 第一个参数 `[owner, repo]` 是缓存的 key，也作为参数传递给 fetcher 函数。
  // - 第二个参数是 fetcher 函数，这里直接使用上面定义的 fetchGithubStars。
  //   使用数组解构 `([owner, repo]) => ...` 来接收 key 中的参数。
  // - 第三个参数是配置对象。
  const { data, isLoading, error } = useSWR(
    [owner, repo], // 唯一标识符，用于缓存和去重
    ([owner, repo]) => fetchGithubStars(owner, repo), // 数据获取函数
    {
      // 配置选项：
      revalidateOnFocus: false, // 窗口重新获得焦点时，不自动重新请求数据
      dedupingInterval: 60000, // 去重间隔：60秒内对于相同的 key 最多只发起一次请求
    }
  );

  // 返回格式化后的结果。
  return {
    // 从返回的 data 中安全地提取 stargazers_count。
    // 如果 data 是 undefined 或 null，则使用 0 作为默认值。
    stargazersCount: data?.stargazers_count ?? 0,
    // 直接传递 useSWR 返回的加载状态。
    isLoading,
    // 直接传递 useSWR 返回的错误对象，并明确其类型。
    error: error as Error | null,
  };
}
