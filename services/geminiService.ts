import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedImage, DecadeConfig } from '../types';

// Hardcoded base64 representation of the P/S Gum Expert toothpaste image.
const PS_GUMEXPERT_MIME_TYPE = 'image/png';
const PS_GUMEXPERT_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAIAAADwf7zUAAAAA3NCSVQICAjb4U/gAAAAGXRFWHRTb2Z0d2FyZQBnbm9tZS1zY3JlZW5zaG907wO/PgAAIABJREFUeJzs3cmSHce5J/bN/lq/q+qZ6R52BgYyD8DCCAyEEAggAYlEIpHIJJvL3+S3+S2bzWQzI0kEaUACgSAABjwgAy/MzHRPdXv1N5P9s9/uYCaGmJkZGe+D69KqZ6b7uqd3v/e97/0t29atW/8rS5cuXb44S5YsWbJ48R8sWLBgwcJ9LFiwYMGChftYsGDBl/y1/+9vGDBgwIAB/+/o0aNHzx42bNiwYcO/+l8bNmy4deu2devWHd/s3LkzV65cuf/v5s2b/f39Bw8e7OzsjIyMjI6OdnZ2Tp48OTY2Njc3d+7cufv379+8efPmzZunT58+f/78+fPnz58/v3jx4sWLFy9evPjx4sWL8+fPnz9/fv78+fXr18+fX758efny5cuXL1++fPny5cuX33//+vXXX1++/Pnnn1++fP78+fXr12/evHnz5s3du3f7+vr6+/sHBwdHR0dHRESMjY1lZWWHDx9++vTpixcvXr58+fr16z9//vj588effz59+vT58+f///3/+/+fPXv27Nnz3//+v/73/w8fPny4efPmyZMnR0dHR0dHZ2dnOzs7u3fv7u/vHxsbm5qampmZ2djY+PTp08ePH8/Pz//666/Pnz+fP3/+8+fPnz9//vz58+fPnx8vX378+PGjR4+eP3/+8+fPnz9/fv/+/fPnz69fv37+/PXr16/fv3//9u3bN2/ePH/+fPfu3bu7u3t7e4eHh0dHR0dGRmZnZ3d3d/f29g4ODg4ODqanp6enpwcHB0dHR8fGxvLz83Nzc/Pz8/fv379+/fply5cvX76cPn16cHBwZGRkZGTExsbm5ubm5+f/9re/nTx58vTp08vLyyMjI/v27evv7x8bG5uamrq6uh4/frysrOzZs2dPnjz59OnTyMjI2NjYzZs3d3Z2NjY27t+/v7Ozs7OzExMTIyMji4uLo6OjgwYNevTRR19++eUnn3xy9OjRHTt2HD58ePv27SNHjhQVFfX29u7v7x8dHQ0ICGhoaEhISAgICAgICEhKSg4ePNjd3T05OTkxMbGwsHDo0KGFhYXV1dX19fW1tbXl5eVFRESlpaX5+fmJiYklJSVVVVW3bt3a29vDw8PT0tJycnJqa2sbGxtVVVWlpaWZmZmmpqaqqqqqqurq6qqqioqKiopKSkrKy8vLzMycnp6enJzMyMiorKwsKysrLCzMycmZlZXl6OiYkpIyMjIqKyv37t2bnp5eWlrq7+8vLCwMDAQEBAQUFBSUlJRkZGSioqJKS0spKSmJiYlJSUnp6emVlZVVVVVZWVklJSVlZWUFBQVFRUUlJSX5+flJSUlFRUUNDQ3t7e0dHR0lJSW5ubnp6eoWFhW1tbcHBwYGBgYKCgrKysoiIiIiIiKCgoJaWluaqqrqmpqaqqqqioqKioiIiIiIiIiIiIiKiurq6sbGxiYmJhISErKyspqamlpaWqqqqSktLKyurrq6urq6ur6/v6OiopKTk6OjI3NzcwsLC3t7ewMDA3d3dwMDAgICAgoKCgoKCpqamra2tnp6eoqKimzdv/vzzzwsLCyMjIyMjIysrq7Gxsa2trbe39/r161++fH38+PGVK1eGhIRUV1d//vnni4uLY8eOHT16tLOz8/bt2zt27Bg7duzk5GRDQ0NzcnLKysoWL178/fffnz9//vz5s+fPn588eXL37t2RkZEzZ85UV1cfP35cVlZ25MgRWVnZoUOHdu/evbi4+PDhwyVLlhQXFx8+fHjx4sWVK1eSkpKKiop++umn0NDQ+fPnp0+f/tNPP728vJSUlLS1tW1tbd3d3Y2NjWVlZQUFBYmJiYGBgYKCgr6+vqqqqrq6ur6+voKCgoCAgICAgIKCgra2tr29vb29/fDhwy+//PLbb7/98MMP3d3de/fuXVRUZGZmjho16tFHH/3ggw/mz59fuHDhrVu35s+ff+HChT/++OPp06cfP3589uxZr169evToERwc7OvrGxwc/O2339avX79x48YZM2bs3r07MzNz2rRpt27dWltbe/DgwbNnzw4cOHDy5MmhoaHbt28fPnz43//+97Jly1588cX58+fn5uZWVFQ0NDSEhISUl5dXVlbW1NSUlZU1NTV9fX1TU1NLSwshISElJSVJSUlCQkJCQkJcXV1jY2NJSUlJSUlCQkJISEhERERERERPT09ERERERES3bt0aHR0dHx/ftm3btWvXtm3b5ufnv/zyy9u3b09PT9+//w+S/1v8S9asWbNmzX8+derUYcOGDRgw4NSpUydPngz3/uWzZ8+ePn3avXt3QECAp6fngAEDfvjhB1RUVEeOHPnjjz9ev34dGhr64MGDc+fOTUxMjI+P37x5c/jw4RMnTkhKStLR0Rk6dOjkyZOTk5N3796dPHmyoKCgv79/bm5uTk7O+Pj4yMjI5cuXr1279t13342NjV26dKlXr163b9/+6aef9vb2Xrhw4Ycffujs7Hx69erZs2ft7e0RERGcnJyGhoZCQkJ8fX0rKyvv37+fnJz85ZdfVlZWfn5+Z86cuXPnjt+//w/S/1v8S9asWbNmzX82depUYGBgZ8+ebdiwYd++fcOGDevSpcu8efPAwMDef/99YGDgL7/8snXr1iuvvLL66qu3bNmye/dueXl5TU1NWVnZn3/+uWHDBpWVldnZ2fPnz//qq6/++OOPq1ev3rRp01dffaVNmzatW7ceFRW1aNEiIyMjLS3t6tWrv/3229q1a0+ePLlz505aWtqWLVtuvvnmLVu2nDlzZu3atZMmTbr88st3794VFBTk5ORcvXr10KFDW7ZsefPNN7/88sugQYO+973vbd++fcmSJRUVFdu2bVuyZMmSJUvmz58fERHh4+Pz/Pnz58+fP3/+/Pnz/+/B2rV/yZp17twZFRU1ePDg33///Z133lkwYMCKFSuWLFlSunRpQ0PD/fffP2/evFmzZp0+fdra2tq5c+cqKyt37Nhx7dq1ixcvvv7661u3btW0adOMjIx//etfjIyMduzY8eWXX6akpNxxxx0vLy95eXlbtmy59tprV69evWTJEkNTU9u2bbtz587Ro0evXLny3nvvnTx5cu7cucOHD9+8eXPp0qX+/v5er9eLx+OtrKxsbGwGBgZCQkJWVlZ3d3dGRkZ6evq1a9cWL168du3agAEDvv322w8++GCDBg2ioqIuXrz46quvHjhwoKGh4Wtf+9rOnTsjIiIGDBhgsVhevXoVGxurqamZnp5eWVmZm5u7fv16UVERHx+/YsWKqVOn9u/f/+OPPw4dOnTs2LGZmZnjx4+/9tprV69evWTJEkFBwTfffPPSSy9hYWEvvvjioEGDtm7dGhYWFhcXBwQEDBgwwGIx126gV69enTt3rlev3qxZsxobG//rv/4rKirq6+t74IEHTp8+DQ0N3bx589ChQydOnHjt2jVQUFD48MMPs2fPvvjiiwsXLpQ0afJrr7125513Dh48OGXKFFNTU1dXV0tLy9atW+/du3fgwIFr1qwZNWpUdXX1+fPn3//+9zds2LB58+bp06fPnDnzxRdfXFpaqqqqOnjw4IULF3x9fZ2cnMzNzd27d+/ChQuPHz/etGnTiRMnVlZWLlq0aNSoUW5ubkZGxnvvvdff379+/fovv/wyJCQkLS2tqqpqZmbm4OCgoKAAAgIePXo0NTWVk5OTl5e3YMGCVatWTZgw4frrr2dkZDz//PMTJkz47//+b6tWrb744ovTp0//+OOPs7KyRowYsWDBgoGBgWXLlv3ud7+bO3cufuX9R48e3bhxY/fu3f7+/vHx8bm5uZmZmVVVVcXFxfv371+6dKmoqOjatWvNzc1xcXGJiYkXL168ffv2woULL1++fP36dWlp6Y4dO37++WdoaOjs2bOTk5O7du06efJkQUEBKyvrqquuOn/+fO7cuQkTJry9vbdt27Z58+b33nvvyJEjjY2NaWlpycnJycnJO3fuXLhw4e3bt4mJiZWVlfn5+R4eHj4+vnHjxtXV1dWUlJTc3NzMzMzi4uLi4uLm5uaenp6enp6VlZXl5eXl5eXFxUXl5WXl5eU5OTnZ2dl5eXmpqamJiYllZWXp6elZWVlFRUVpaWlRUVFxcXFNTU1dXV1NTEyMjIxsbGzk5OYmJiSUlJWVlZW5ubiQkJDIyMtra2goLC5ubm+vr66uqqubNm1dSUhoaGhITE7OysgICAqqrq2tqaqqqqrq6ulpaWhISEmpqapqamrKysrKysoSEhISEhMzMzLKysmpqaoSEhISEhNLS0kpKStzc3Li4uNzc3IiIiLi4uFpamqqqqlpaWpKSkpSUlCwsLDQ0tLq6urGxkZOTExkZWVlZCQkJubm5gYGB/v7+pqampqamqKioioqKilpaWioqKioqKampqmpqa6urq6enpgYGB3t7eZmZmWlpalpaWRUVFRUVFXV1deXl5ZWVldXU1LS0tKysrKysrKysrLy9va2sLCwubm5vb29tbW1sLCwsvL68sLDwsLDy8vDz8PDxw8PBwcHBYWFhYWFhYWFjY3NzcwMDA3t7e1tZWWVlZWVlZWVlZcXFxRkZGSUlJaWlpWVlZWVlZWVlZWVlZWlpaTk5OUlJScnJycnJyQkJCREREREREMzMzi4uLExMTCQkJWlpa2trapqamra2tnp6ejo6OampqmpqaioqKioqKgoKCpqamra2tnp6eoqKikpKSkpKSioqKampqmpqampqa6urq6urqioqKioqKioqKSkpKenp6ampqmpqaampqaampq6urq+vr6ampqioqKampq6urqmpqaqqqqSktLKyurrq6urq6uoaGhvb29kZGRs7Pz8PDw9PTEz8/Pycl59erV58+fn5+f/9dff3V1de/cuXv69On58+fLly9/+fLlkydP7t69Ozs7Ozo6Ojs7Ozw83NnZWVBQUFVVNTg4eODAgaSkpFOnTn388ccLFy587rnny5Yt+9e//lVTU3P8+PGSkhK/fv169OiRkZExdepUR0fHCRMm7Nmz55prrlmxYsUbb7xRVFTU3d3t5eW1adOmTZs2HT9+/NatWwcPHvx///d/ly5dessttxw/fvzUqVN37NhRWVk5e/bsAw888Mknn5w8efKdd95ZuHChv7//gQceWLt2bbGxsYmJiffu3Xv37t3S0jIyMvLYsWOXLl26d+9uYWDg/Pnzt2/ffuHChV27dhUWFl64cOHbb7+dO3fu5s2bCwoKFixYsGvXrlu3bl28eLH8/PycnJyCgoL79+/Pz88vLy8vLy+tra3r6up6enrW1tZWVVUFBQV5eXnp6enJyckZGRnl5eXFxUXl5RUVFWXl5T09PQkJCQEBgeLi4pSUlLKysoiIiISEhICAAL/fLygoKCsrKywsrKqqKigoGBkZGRkZWVhYWFpaampqWlpaSktLS0tLSkpKysrKampq6urqmpqaqqqqSktLSkpKenp6ampqmpqaampq6urq+vr6+vp6enp6enp6ampqmpqampqampqampqampq6urq6urq6urqKioqKioqKampqmpqampqamrq6urq6uqKioqKioqKioqKSkpKenp6ampqmpqaampq6urq+vr6ampqioqKampq6urqmpqamrq6urq6urKyspKSkpaWlpaWlpaWVlZWVlZWVlZcXFxWVVVZWVlZWVlZWVlZWVlZWVlZWVlJWVlJaWlpaWlpaWlpaSUlJSUlJScnJycnJycnJycnJycjIyMiIiISEhISEhLi4uLi4uJiYmJiYmJiUlJSUlJScnJycjIyMjIiIiIiIiIiIiIiIiISEhISEhISEhISEuLi4uLi4uLiYmJiYmJiUlJSUlJScnJycnJycjIyMiIiIiIiISEhISEhISEhISEhLi4uLi4uJSUlJSUlJSUlJScnJycnIyMjIyMiIiIiISEhISEhISEhLi4uLi4uJiYmJSUlJSUlJycnJycnIyMjIyMiIiIiISEhISEhIS4uLi4uLiYmJiYmJiYlJSUlJScnJycnJycjIyMjIyMiIiISEhISEhISEhLi4uLi4uJSUlJSUlJScnJycnJyMjIyMjIiIiIiIiIiISEhISEhISEuLi4uLiYmJiYmJiUlJSUlJSUnJycnJycnJyMjIyMjIyMiIiISEhISEhISEuLi4uLi4uJiYmJiYmJiUlJSUlJSUnJycnJyMjIyMjIyIiIiIiIiIiIiIiIiIiISEhISEhISEhLi4uLi4uJiYmJiYmJiUlJSUlJSUnJycnJycnIyMjIyMjIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIi-gavoAAAABJRU5ErkJggg==';

const decades: DecadeConfig[] = [
    {
      year: '1980s',
      prompt: 'RWRpdCB0aGUgcHJvdmlkZWQgcGhvdG8gdG8gbG9vayBsaWtlIGEgdmVyeSBvbGQsIHBvb3ItcXVhbGl0eSBwaG90byB0YWtlbiBpbiBWaWV0bmFtIGR1cmluZyBU4bq/dCBpbiB0aGUgMTk4MHMuIFRoZSBzdHlsZSBtdXN0IGJlIGJsYWNrIGFuZCB3aGl0ZSB3aXRoIGhlYXZ5IGdyYWluIGFuZCBmaWxtLWxpa2UgdGV4dHVyZS4gVGhlIGJhY2tncm91bmQgc2V0dGluZyBtdXN0IGxvb2sgcG9vciwgYWxtb3N0IG5vIGZvb2Qgb3IgZGVjb3JhdGlvbnMgdmlzaWJsZSwgbWF5YmUganVzdCBhIHNpbXBsZSB3YWxsLiBUaGUgcG9zZSBtdXN0IGJlIGZvcm1hbCBhbmQgc3RhdGljLiBPdXRmaXRzIHNob3VsZCBiZSBzaW1wbGUgdHJhZGl0aW9uYWwgIsOhbyBkw6BpIiBmb3Igd29tZW4gb3IgYSBiYXNpYyBidXR0b24tdXAgc2hpcnQgZm9yIG1lbi4gVGhlIGZhY2lhbCBleHByZXNzaW9uIG11c3QgYmUgYSBiaXQgc2FkIG9yIHJlc2VydmVkLCB3aXRoIG5vIHNtaWxlLiBUaGUgcGVyc29uIG11c3QgcmVtYWluIHJlY29nbml6YWJsZSBhbmQgdGhlIHNhbWUgYWdlLg==',
      description: 'A black & white photo capturing the simple, traditional Tết of the 80s.'
    },
    {
      year: '1990s',
      prompt: 'RWRpdCB0aGUgcHJvdmlkZWQgcGhvdG8gdG8gbG9vayBsaWtlIGFuIGVhcmx5IDM1bW0gY29sb3IgcGhvdG9ncmFwaCBmcm9tIFZpZXRuYW0gZHVyaW5nIFRcdTAxZjl0IGluIHRoZSAxOTkwcywgc2hvd2luZyBzbGlnaHRseSBiZXR0ZXIgbGlmZSBjb25kaXRpb25zIGJ1dCBzdGlsbCBwb29yLiBDb2xvcnMgc2hvdWxkIGJlIGZhZGVkIHdpdGggYSB3YXJtLCBhbmFsb2cgdGludC4gVGhlIGJhY2tncm91bmQgc2hvdWxkIGJlIGEgc2ltcGxlIGhvbWUgc2V0dGluZyB3aXRoIG1vZGVzdCBkZWNvcmF0aW9ucyBsaWtlIGEgc21hbGwgcGVhY2ggYmxvc3NvbSBicmFuY2guIFRoZSBwb3NlIHNob3VsZCBiZSBzbGlnaHRseSBtb3JlIHJlbGF4ZWQuIE91dGZpdHMgY2FuIGluY2x1ZGUgbW9yZSBtb2Rlcm4gdG91Y2hlcyBidXQgc3RpbGwgbG9vayBzaW1wbGUuIFRoZSBleHByZXNzaW9uIHNob3VsZCBiZSBhIGdlbnRsZSwgcmVzZXJ2ZWQgc21pbGUsIG5vdCBzaG93aW5nIHRlZXRoLiBUaGUgcGVyc29uIG11c3QgcmVtYWluIHJlY29nbml6YWJsZSBhbmQgdGhlIHNhbWUgYWdlLg==',
      description: 'The dawn of color, with the hopeful and gentle smiles of the 90s.'
    },
    {
      year: '2000s',
      prompt: 'UGxlYXNlIGVkaXQgdGhlIHByb3ZpZGVkIHBob3RvIG9mIHRoZSBwZXJzb24uIFJlY3JlYXRlIHRoZSBzY2VuZSB0byBsb29rIGxpa2UgaXQgd2FzIHRha2VuIHdpdGggYW4gZWFybHkgZGlnaXRhbCBjYW1lcmEgZHVyaW5nIFRcdTAxZjl0IGluIHRoZSAyMDAwcyBpbiBWaWV0bmFtLCBzaG93aW5nIGEgbXVjaCBiZXR0ZXIgYW5kIG1vcmUgYWZmb3JkYWJsZSBxdWFsaXR5IG9mIGxpZmUuIFRoZSBuZXcgaW1hZ2Ugc2hvdWxkIGhhdmUgaGlnaCBzYXR1cmF0aW9uIGFuZCBjb250cmFzdC4gVGhlIGJhY2tncm91bmQgc2hvdWxkIGJlIGEgbGl2aW5nIHJvb20gd2l0aCBhIGJveHkgQ1JUIHRlbGV2aXNpb24gYW5kIG1vcmUgYWJ1bmRhbnQgVMOpdCBkZWNvcmF0aW9ucy4gVGhlIHBlcnNvbiBzaG91bGQgaGF2ZSBhIGhhcHB5LCBvcHRpbWlzdGljIHNtaWxlLCBzaG93aW5nIHNvbWUgdGVldGguIE91dGZpdHMgc2hvdWxkIGJlIHRyZW5keSBmb3IgdGhlIDIwMDBzLiBUYWtlIHRoZSBQL1MgdG9vdGhwYXN0ZSBwcm9kdWN0IGZyb20gdGhlIHJlZmVyZW5jZSBpbWFnZSB0aGF0IGZvbGxvd3MgdGhpcyB0ZXh0LCBhbmQgcGxhY2Ugb25seSB0aGUgcHJvZHVjdCBpbnRvIHRoZSBuZXcgc2NlbmU7IGl0IHNob3VsZCBiZSBzdWJ0bHkgdmlzaWJsZSBpbiB0aGUgYmFja2dyb3VuZCwgcGVyaGFwcyBvbiBhIHNoZWxmLіBEbyBub3QgaW5jbHVkZSB0aGUgd2hpdGUgYmFja2dyb3VuZCBmcm9tIHRoZSByZWZlcmVuY2UgaW1hZ2UuIFRoZSBwZXJzb24gbXVzdCByZW1haW4gcmVjb2duaXphYmxlIGFuZCB0aGUgc2FtZSBhZ2Uu',
      description: 'Vibrant colors and growing confidence mark the new millennium\'s smiles.'
    },
    {
      year: '2010s',
      prompt: 'UGxlYXNlIGVkaXQgdGhlIHByb3ZpZGVkIHBob3RvIG9mIHRoZSBwZXJzb24uIFJlY3JlYXRlIHRoZSBzY2VuZSB0byBoYXZlIGEgc2hhcnAsIGNsZWFyIHF1YWxpdHksIGFzIGlmIHRha2VuIHdpdGggYSBEU0xSIGNhbWVyYSBkdXJpbmcgVMOpdCBpbiB0aGUgMjAxMHMgaW4gVmlldG5hbS4gVGhlIHBvc2Ugc2hvdWxkIGJlIGNhbmRpZCBhbmQgam95ZnVsLiBUaGUgb3V0Zml0IG11c3QgYmUgYSBoaXAtaG9wIG9yIHN0cmVldCBzdHlsZSwgYW5kIHRoZSBoYWlyc3R5bGUgc2hvdWxkIGhhdmUgY29sb3Igb3IgaGlnaGxpZ2h0cy4gVGhlIHNtaWxlIHNob3VsZCBiZSBicmlnaHQgYW5kIGNvbmZpZGVudCwgc2hvd2luZyB3aGl0ZSB0ZWV0aC4gVGFrZSB0aGUgUC9TIGZyb20gdGhlIHJlZmVyZW5jZSBpbWFnZSB0aGF0IGZvbGxvd3MgdGhpcyB0ZXh0LCBhbmQgcGxhY2UgaXQgaW50byB0aGUgbmV3IHNjZW5lLCBmb3IgZXhhbXBsZSBpbiBhIGdpZnQgYmFza2V0IG9yIG9uIGEgZGlzcGxheS4gRG8gbm90IGluY2x1ZGUgdGhlIHdoaXRlIGJhY2tncm91bmQgZnJvbSB0aGUgcmVmZXJlbmNlIGltYWdlLiBUaGUgcGVyc29uIG11c3QgcmVtYWluIHJlY29nbml6YWJsZSBhbmQgdGhlIHNhbWUgYWdlLg==',
      description: 'Modern, digital clarity and confident smiles from the 2010s.'
    },
    {
      year: '2020s',
      prompt: 'UGxlYXNlIGVkaXQgdGhlIHByb3ZpZGVkIHBob3RvIG9mIHRoZSBwZXJzb24uIFJlY3JlYXRlIHRoZSBzY2VuZSB0byBiZSBoeXBlci1yZWFsaXN0aWMgYW5kIG1vZGVybiwgYXMgaWYgdGFrZW4gd2l0aCBhIGZsYWdzaGlwIHNtYXJ0cGhvbmUgaW4gcG9ydHJhaXQgbW9kZSBkdXJpbmcgVMOpdCBpbiB0aGUgMjAyMHMgaW4gVmlldG5hbS4gVGhlIHNldHRpbmcgc2hvdWxkIGJlIGEgdHJlbmR5LCBiZWF1dGlmdWxseSBkZWNvcmF0ZWQgbW9kZXJuIGhvbWUuIFRoZSBwb3NlIG11c3QgYmUgYSBjb25maWRlbnQsIHN0eWxpc2ggc2hvdC4gVGhlIHNtaWxlIG11c3QgYmUgdGhlIG1haW4gZm9jdXM6IGJyaWxsaWFudCwgZGF6emxpbmcsIGFuZCBzaG93aW5nIHBlcmZlY3RseSB3aGl0ZSB0ZWV0aC4gVGFrZSB0aGUgUC9TIGJveCBhbmQgdHViZSBmcm9tIHRoZSByZWZlcmVuY2UgaW1hZ2UgdGhhdCBmb2xsb3dzIHRoaXMgdGV4dCwgYW5kIGNsZWFybHkgYW5kIGFydGlzdGljYWxseSBwbGFjZSBvbmx5IHRoZSBwcm9kdWN0IGludG8gdGhlIG5ldyBjb21wb3NpdGlvbi4gRG8gbm90IGluY2x1ZGUgdGhlIHdoaXRlIGJhY2tncm91bmQgZnJvbSB0aGUgcmVmZXJlbmNlIGltYWdlLiBUaGUgcGVyc29uIG11c3QgcmVtYWluIHJlY29nbml6YWJsZSBhbmQgdGhlIHNhbWUgYWdlLg==',
      description: 'Ultra-realistic quality showcasing a brilliant, confident smile of today.'
    }
];

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const generateTetJourneyImages = async (
  imageFile: File,
  onProgress: (year: string) => void
): Promise<GeneratedImage[]> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API key is not configured. Please set the process.env.API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const { base64: userImageBase64, mimeType: userImageMimeType } = await fileToBase64(imageFile);

  const userImagePart = { inlineData: { data: userImageBase64, mimeType: userImageMimeType } };
  const toothpasteImagePart = { inlineData: { data: PS_GUMEXPERT_BASE64, mimeType: PS_GUMEXPERT_MIME_TYPE } };

  const generatedImages: GeneratedImage[] = [];

  // Helper to decode Base64 strings, handling UTF-8 characters correctly.
  const decodePrompt = (base64: string) => {
    try {
      return decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch(e) {
      // Fallback for simpler strings, though less robust for UTF-8.
      return atob(base64);
    }
  };

  for (const decade of decades) {
    onProgress(decade.year);
    try {
      const decodedPrompt = decodePrompt(decade.prompt);
      let parts;
      if (['2000s', '2010s', '2020s'].includes(decade.year)) {
        // For multi-image prompts, the order [image_to_edit, text_prompt, reference_image] is more reliable.
        parts = [userImagePart, { text: decodedPrompt }, toothpasteImagePart];
      } else {
        // For single-image prompts, [image, text] is the standard and more reliable order.
        parts = [userImagePart, { text: decodedPrompt }];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: parts,
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData?.data) {
        generatedImages.push({
          year: decade.year,
          description: decade.description,
          src: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
        });
      } else {
        throw new Error(`Image generation failed for decade ${decade.year}. The model did not return an image.`);
      }
    } catch (error) {
      console.error(`Error generating image for ${decade.year}:`, error);
      let detail = "An unknown error occurred.";
      if (error instanceof Error) {
        try {
          const errJson = JSON.parse(error.message);
          detail = errJson?.error?.message || error.message;
        } catch (e) {
          detail = error.message;
        }
      }
      throw new Error(`Failed to generate image for ${decade.year}. ${detail}`);
    }
    // Add a delay between API calls to avoid rate limiting issues.
    await delay(2000);
  }

  return generatedImages;
};