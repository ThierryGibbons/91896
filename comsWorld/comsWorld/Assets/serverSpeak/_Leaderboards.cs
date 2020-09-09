using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class _Leaderboards : MonoBehaviour
{

    void Update()
    {
        // submit yeahNah amount 1
        if (Input.GetKeyDown("a"))
        {
            print("key 'a' was pressed");
            _SubmitMsg(1);
            // TODO: Submit a chosen amount of 'yeahNah' through a selector.
        }
    }

    private static string _Url = "http://localhost";
    private static string _Port = "8080";

    public void _SubmitMsg(int yeahNah)
    {
        StartCoroutine(_SubmitMsgToServer(yeahNah));
    }

    private IEnumerator _SubmitMsgToServer(int yeahNah)
    {
        Debug.Log("Submitting yeahNah");

        // Create a form that will contain our data
        WWWForm form = new WWWForm();
        form.AddField("yeahNah", yeahNah.ToString());

        // Create a POST web request with our form data
        UnityWebRequest www = UnityWebRequest.Post(_Url + ":" + _Port, form);
        // Send the request and yield until the send completes
        yield return www.Send();

        if (www.isNetworkError)
        {
            // There was an error
            Debug.Log(www.error);
        }
        else
        {
            if (www.responseCode == 200)
            {
                // Response code 200 signifies that the server had no issues with the data we went
                Debug.Log("Form sent complete!");
                Debug.Log("Response:" + www.downloadHandler.text);
            }
            else
            {
                // Any other response signifies that there was an issue with the data we sent
                Debug.Log("Error response code:" + www.responseCode.ToString());
            }
        }
    }
}
