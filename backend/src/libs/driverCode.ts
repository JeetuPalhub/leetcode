
export const getDriverCode = (title: string, language: string, sourceCode: string): string => {
    // Normalize title to handle case/spacing
    const normalizedTitle = title.toLowerCase().trim();

    if (normalizedTitle === 'two sum') {
        if (language === 'javascript' || language === 'typescript') {
            return `
${sourceCode}

// Driver Code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
    const nums = JSON.parse(input[0]);
    const target = parseInt(input[1]);
    const result = twoSum(nums, target);
    console.log(JSON.stringify(result));
}
`;
        } else if (language === 'python' || language === 'python3') {
            return `
import sys
import json

${sourceCode}

# Driver Code
if __name__ == "__main__":
    input_data = sys.stdin.read().strip().split('\\n')
    if len(input_data) >= 2:
        nums = json.loads(input_data[0])
        target = int(input_data[1])
        result = twoSum(nums, target)
        print(json.dumps(result))
`;
        } else if (language === 'java') {
            return `
import java.io.*;
import java.util.*;

${sourceCode}

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line1 = br.readLine();
        String line2 = br.readLine();
        
        if (line1 != null && line2 != null) {
            line1 = line1.trim();
            line1 = line1.substring(1, line1.length() - 1);
            String[] parts = line1.split(",");
            int[] nums = new int[parts.length];
            for(int i=0; i<parts.length; i++) {
                if(!parts[i].trim().isEmpty())
                    nums[i] = Integer.parseInt(parts[i].trim());
            }
            
            int target = Integer.parseInt(line2.trim());
            
            Solution sol = new Solution();
            int[] result = sol.twoSum(nums, target);
            System.out.println("[" + result[0] + "," + result[1] + "]");
        }
    }
}
`;
        }
    }

    // Default: Return original code if no driver found (or different problem)
    return sourceCode;
};
